import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, mode, step } = useGame();

  // Redirect to the join page when game is reset (step is -1)
  useEffect(() => {
    if (step === -1) {
      navigate("/join");
    }
  }, [step, navigate]);

  // Restore player name from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);
      socket.emit("player-join", stored);
    }
  }, [setPlayerName, socket]);

  // Handle player name input and joining
  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    socket.emit("player-join", name);
  };

  // Redirect when game starts and step is updated (for example, to /play/majority)
  useEffect(() => {
    if (step >= 0 && mode) {
      navigate(`/play/${mode}`);
    }
  }, [step, mode, navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">👋 Enter Your Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name..."
        className="border rounded px-4 py-2"
      />
      <button
        onClick={handleJoin}
        className="ml-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Join Game
      </button>
    </div>
  );
}
