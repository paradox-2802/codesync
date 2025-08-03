import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { PlayCircle } from "lucide-react";
import axios from "axios";

// Set Axios base URL from environment
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const StartSession = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  // Set default name from Clerk user
  useEffect(() => {
    if (user) {
      const defaultName = user.fullName || user.username || "";
      setUserName(defaultName);
    }
  }, [user]);

  const handleStart = async () => {
    if (!userName.trim()) {
      toast.error("Please enter a name", {
        position: "top-center",
      });
      return;
    }

    try {
      const res = await axios.post(
        "/api/session/create",
        { userName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data?.roomId) {
        navigate(`/layout/${res.data.roomId}`, {
          state: { userName },
        });
      } else {
        toast.error("Failed to create room", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Session creation failed:", err);
      toast.error("Server error", {
        position: "top-center",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black border border-gray-300">
        <DialogTitle className="text-xl font-semibold mb-2">
          Start a Session
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600 mb-4">
          Enter your name to begin collaborating.
        </DialogDescription>

        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 bg-white text-black"
        />

        <button
          onClick={handleStart}
          aria-label="Start Session"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          <PlayCircle className="w-4 h-4" />
          Start
        </button>
      </DialogContent>
    </Dialog>
  );
};
