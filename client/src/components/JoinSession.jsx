import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { toast } from "react-hot-toast";
import { LogIn } from "lucide-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const JoinSession = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!userName.trim() || !roomId.trim()) {
      toast.error("Both name and Room ID are required", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await axios.post("/api/session/validate", { roomId });

      if (res.data.exists) {
        navigate(`/layout/${roomId}`, {
          state: { userName },
        });
      } else {
        toast.error("Room does not exist", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Join session error:", err);
      toast.error("Server error", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black border border-gray-300">
        <DialogTitle className="text-xl font-semibold mb-2">
          Join a Session
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mb-4">
          Enter your name and Room ID to join an existing session.
        </DialogDescription>

        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2 bg-white text-black"
        />
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black"
        />

        <button
          onClick={handleJoin}
          aria-label="Join Session"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          <LogIn className="h-5 w-5" />
          Join
        </button>
      </DialogContent>
    </Dialog>
  );
};
