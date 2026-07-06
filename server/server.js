import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import sessionRoutes from "./routes/session.js";
import suggestionRoutes from "./routes/suggestions.js"
import { roomManager } from "./inMemorydb/roomManager.js";

dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : "*";
  
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/session", sessionRoutes);
app.use("/api/suggestions", suggestionRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    rooms: roomManager.roomCount(),
    connections: io.engine.clientsCount,
  });
});

// Wandbox code execution configuration (free, no API key required)
const WANDBOX_API_URL =
  process.env.WANDBOX_API_URL || "https://wandbox.org/api/compile.json";

// Maps app languages to Wandbox compilers
const LANGUAGE_MAP = {
  javascript: { compiler: "nodejs-20.17.0" },
  python: { compiler: "cpython-3.10.15" },
  cpp: {
    compiler: "gcc-13.2.0",
    extra: { "compiler-option-raw": "-std=c++17" },
  },
  java: { compiler: "openjdk-jdk-22+36" },
};

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔌 New connection:", socket.id);

  let currentRoom = null;
  let currentUser = null;

  // Heartbeat for connection monitoring
  const heartbeatInterval = setInterval(() => {
    if (!socket.connected) {
      clearInterval(heartbeatInterval);
      return;
    }
    socket.emit("ping");
  }, 30000);

  socket.on("pong", () => {
    // Connection is alive
  });

  socket.on("join", ({ roomId, userName }, callback) => {
    try {
      if (!roomId || !userName) {
        throw new Error("Room ID and username are required");
      }

      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        roomManager.removeUser(currentRoom, currentUser);
      }

      currentRoom = roomId;
      currentUser = userName;

      socket.join(roomId);
      const room = roomManager.addUser(roomId, userName);

      // Notify room
      io.to(roomId).emit("room-update", {
        users: room.users,
        roomId,
        timestamp: new Date(),
      });

      // Send current room state to new user via callback
      if (typeof callback === "function") {
        callback({
          status: "success",
          code: room.code,
          language: room.language,
          users: room.users,
        });
      }

      console.log(`👋 ${userName} joined room ${roomId}`);
    } catch (error) {
      console.error("Join error:", error.message);
      if (typeof callback === "function") {
        callback({
          status: "error",
          message: error.message,
        });
      }
    }
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (roomManager.exists(roomId)) {
      roomManager.setCode(roomId, code);
      socket.to(roomId).emit("code-change", {
        code,
        updatedBy: currentUser,
        timestamp: new Date(),
      });
    }
  });

  socket.on("language-change", ({ roomId, language }) => {
    if (roomManager.exists(roomId)) {
      roomManager.setLanguage(roomId, language);
      io.to(roomId).emit("language-change", language);
    }
  });

  // Add input-change handler
  socket.on("input-change", ({ roomId, input }) => {
    if (roomManager.exists(roomId)) {
      roomManager.setInput(roomId, input);
      socket.to(roomId).emit("input-update", input);
    }
  });

  // Handle code execution requests
  socket.on("run-code", async ({ roomId, input }, callback) => {
    try {
      if (!roomManager.exists(roomId)) {
        throw new Error("Room does not exist");
      }

      const room = roomManager.getRoom(roomId);
      const langConfig = LANGUAGE_MAP[room.language];

      if (!langConfig) {
        throw new Error(`Unsupported language: ${room.language}`);
      }

      // Update room input
      roomManager.setInput(roomId, input);

      let sourceCode = room.code;
      if (room.language === "java") {
        // Wandbox writes the source to prog.java, so a top-level `public class`
        // fails to compile. Wandbox auto-runs whichever class has main(), so
        // dropping the `public` modifier makes any Java snippet runnable.
        sourceCode = sourceCode.replace(
          /\bpublic\s+((?:(?:final|abstract|sealed|non-sealed|strictfp)\s+)*class\b)/g,
          "$1"
        );
      }

      const payload = {
        code: sourceCode,
        compiler: langConfig.compiler,
        stdin: input || "",
        ...(langConfig.extra || {}),
      };

      const response = await axios.post(WANDBOX_API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const result = response.data;

      // Extract and format output
      const output = [
        result.compiler_error,
        result.program_output,
        result.program_error,
      ]
        .filter(Boolean)
        .join("\n")
        .trim();

      // Save output to room manager
      roomManager.setOutput(roomId, output);

      // Send result to all clients in the room
      io.to(roomId).emit("code-result", output);

      if (typeof callback === "function") {
        callback({ success: true });
      }
    } catch (error) {
      console.error("Code execution error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      if (typeof callback === "function") {
        callback({
          success: false,
          error: errorMessage || "Failed to execute code",
        });
      }
    }
  });

  socket.on("leave", () => {
    if (currentRoom && currentUser) {
      roomManager.removeUser(currentRoom, currentUser);
      io.to(currentRoom).emit("room-update", {
        users: roomManager.getUsers(currentRoom),
        roomId: currentRoom,
        timestamp: new Date(),
      });
      socket.leave(currentRoom);
    }
  });

  socket.on("disconnect", () => {
    clearInterval(heartbeatInterval);
    if (currentRoom && currentUser) {
      roomManager.removeUser(currentRoom, currentUser);
      io.to(currentRoom).emit("room-update", {
        users: roomManager.getUsers(currentRoom),
        roomId: currentRoom,
        timestamp: new Date(),
      });
    }
    console.log("❌ Disconnected:", socket.id);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Clean up empty rooms periodically
setInterval(() => {
  roomManager.cleanupEmptyRooms();
}, 60 * 60 * 1000); // Every hour

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Allowed origins: ${process.env.ALLOWED_ORIGINS || "All"}`);
});
