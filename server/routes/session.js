import express from "express";
import { v4 as uuidv4 } from "uuid";
import { roomManager } from "../inMemorydb/roomManager.js";

const router = express.Router();

// Create a new room
router.post("/create", (req, res) => {
  const { userName } = req.body;

  if (!userName || userName.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Username is required" });
  }

  const roomId = uuidv4();
  roomManager.addUser(roomId, userName);

  return res.status(201).json({
    success: true,
    message: "Room created successfully",
    roomId,
  });
});

// Validate if room exists
router.post("/validate", (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res
      .status(400)
      .json({ success: false, message: "Room ID is required" });
  }

  const exists = roomManager.exists(roomId);

  return res.status(200).json({ exists });
});

export default router;
