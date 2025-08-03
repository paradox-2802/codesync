import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { Rnd } from "react-rnd";

import Sidebar from "../components/Sidebar";
import CodeEditorPanel from "../components/CodeEditorPanel";
import AISuggestionsPanel from "../components/AISuggestionsPanel";

import jsLogo from "../assets/javascript.svg";
import pyLogo from "../assets/python.svg";
import cppLogo from "../assets/c++.svg";
import javaLogo from "../assets/java.svg";

const socket = io(import.meta.env.VITE_BASE_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 500,
});

const languageOptions = {
  javascript: { label: "JavaScript", logo: jsLogo },
  python: { label: "Python", logo: pyLogo },
  cpp: { label: "C++", logo: cppLogo },
  java: { label: "Java", logo: javaLogo },
};

const themeOptions = ["light", "vs-dark", "hc-black"];

const Layout = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.userName;

  const [users, setUsers] = useState([]);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  const prevUsersRef = useRef([]);

  const handleCodeChange = useCallback(
    (value) => {
      if (value !== undefined && isMounted.current) {
        setCode(value);
        socket.emit("code-change", { roomId, code: value });
      }
    },
    [roomId]
  );

  const handleRoomUpdate = useCallback(({ users: updatedUsers }) => {
    if (isMounted.current) {
      setUsers(updatedUsers);
    }
  }, []);

  const handleCodeResult = useCallback((result) => {
    if (isMounted.current) {
      setOutput(result);
      setLoading(false);
    }
  }, []);

  const handleLanguageUpdate = useCallback((newLang) => {
    if (isMounted.current) {
      setLanguage(newLang);
    }
  }, []);

  const handleInputUpdate = useCallback((newInput) => {
    if (isMounted.current) {
      setInput(newInput);
    }
  }, []);

  const handleUserJoin = useCallback(({ userName: joinedUser }) => {
    toast(`${joinedUser} joined the room!`, {
      icon: "👋",
      position: "top-center",
      style: { background: "#4ade80", color: "#fff" },
    });
  }, []);

  const handleUserLeave = useCallback(({ userName: leftUser }) => {
    toast(`${leftUser} left the room!`, {
      icon: "👋",
      position: "top-center",
      style: { background: "#f87171", color: "#fff" },
    });
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      const newInput = e.target.value;
      setInput(newInput);
      socket.emit("input-change", { roomId, input: newInput });
    },
    [roomId]
  );

  const handleApplySuggestion = (suggestion) => {
    setCode(suggestion);
    socket.emit("code-change", { roomId, code: suggestion });
    toast.success("AI suggestion applied!", {
      position: "top-center",
    });
    setShowAIPanel(false);
  };

  const getAISuggestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/suggestions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        }
      );
      if (!response.ok) throw new Error("Failed to get AI suggestions");
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to get AI suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userName || !roomId) {
      navigate("/", { replace: true });
      return;
    }

    socket.on("room-update", handleRoomUpdate);
    socket.on("code-change", (data) => setCode(data.code));
    socket.on("language-change", handleLanguageUpdate);
    socket.on("input-update", handleInputUpdate);
    socket.on("code-result", handleCodeResult);
    socket.on("user-joined", handleUserJoin);
    socket.on("user-left", handleUserLeave);
    socket.on("error", (error) =>
      toast.error(`Socket error: ${error.message}`)
    );

    socket.emit("join", { roomId, userName }, (response) => {
      if (!isMounted.current) return;

      setJoining(false);

      if (response.status === "success") {
        setCode(response.code || "// Start coding...");
        setLanguage(response.language || "javascript");
        setUsers(response.users || []);
        setInput(response.input || "");
        prevUsersRef.current = response.users || [];

        toast.success(`Joined room ${roomId} successfully!`, {
          position: "top-center",
          style: { background: "#4ade80", color: "#fff" },
        });
      } else {
        toast.error(`Join failed: ${response.message}`, {
          position: "top-center",
          style: { background: "#f87171", color: "#fff" },
        });
        navigate("/", { replace: true });
      }
    });

    return () => {
      isMounted.current = false;
      socket.emit("leave", { roomId, userName });
      socket.off("room-update", handleRoomUpdate);
      socket.off("code-change");
      socket.off("language-change", handleLanguageUpdate);
      socket.off("input-update", handleInputUpdate);
      socket.off("code-result", handleCodeResult);
      socket.off("user-joined", handleUserJoin);
      socket.off("user-left", handleUserLeave);
      socket.off("error");
    };
  }, [
    roomId,
    userName,
    navigate,
    handleRoomUpdate,
    handleLanguageUpdate,
    handleCodeResult,
    handleInputUpdate,
    handleUserJoin,
    handleUserLeave,
  ]);

  const runCode = () => {
    if (!code.trim()) return;

    setLoading(true);
    setOutput("Running...");
    socket.emit("run-code", { roomId, input }, (response) => {
      if (!isMounted.current) return;
      if (!response?.success) {
        setOutput(response?.error || "Execution failed");
        setLoading(false);
        toast.error("Code execution failed!", {
          position: "top-center",
          style: { background: "#f87171", color: "#fff" },
        });
      }
    });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Room ID copied to clipboard!", {
      position: "top-center",
      style: { background: "#4ade80", color: "#fff" },
    });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("language-change", { roomId, language: newLang });
    toast(`Language changed to ${languageOptions[newLang].label}`, {
      icon: "💻",
      position: "top-center",
      style: { background: "#60a5fa", color: "#fff" },
    });
  };

  const handleLeaveRoom = () => {
    toast("Left the room successfully!", {
      icon: "👋",
      position: "top-center",
      style: { background: "#60a5fa", color: "#fff" },
    });
    navigate("/", { replace: true });
  };

  if (joining) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Joining room...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "8px", padding: "12px 16px", fontWeight: 500 },
        }}
      />
      <Sidebar
        roomId={roomId}
        users={users}
        language={language}
        theme={theme}
        copied={copied}
        languageOptions={languageOptions}
        themeOptions={themeOptions}
        onCopyRoomId={copyRoomId}
        onLanguageChange={handleLanguageChange}
        onThemeChange={(e) => setTheme(e.target.value)}
        onLeaveRoom={handleLeaveRoom}
      />

      <main className="flex-1 p-6 bg-purple-50 flex flex-col gap-4 overflow-auto relative">
        {/* AI Panel */}
        <Rnd
          default={{
            x: window.innerWidth - 448,
            y: 80,
            width: 448,
            height: window.innerHeight - 80,
          }}
          minWidth={320}
          minHeight={200}
          bounds="window"
          enableResizing={{
            right: true,
            bottom: true,
            bottomRight: true,
          }}
          className={`z-50 transition-all duration-500 ease-in-out ${
            showAIPanel ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full h-full flex flex-col bg-purple-100 border-l shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 tracking-tight flex items-center">
                <Sparkles
                  className="inline-block mr-2 text-purple-600"
                  size={18}
                />
                AI Assistant
              </h2>
              <div className="flex gap-2 items-center">
                <button
                  onClick={getAISuggestion}
                  disabled={isLoading}
                  className="text-sm font-medium bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 disabled:bg-purple-400 transition"
                >
                  {isLoading ? "Generating..." : "Suggest"}
                </button>
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-200 transition"
                  aria-label="Close AI panel"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <AISuggestionsPanel
                suggestion={suggestion}
                error={error}
                isLoading={isLoading}
                setSuggestion={setSuggestion}
                onApplySuggestion={handleApplySuggestion}
              />
            </div>
          </div>
        </Rnd>

        <CodeEditorPanel
          code={code}
          input={input}
          output={output}
          loading={loading}
          language={language}
          theme={theme}
          showAIPanel={showAIPanel}
          setShowAIPanel={setShowAIPanel}
          onCodeChange={handleCodeChange}
          onRunCode={runCode}
          onInputChange={handleInputChange}
        />
      </main>
    </div>
  );
};

export default Layout;
