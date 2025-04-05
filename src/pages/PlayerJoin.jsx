import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, gameMode, step } = useGame();

  // Restore player name from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);  // Set player name using context
      socket.emit("player-join", stored);  // Emit to server
    }
  }, [setPlayerName, socket]);

  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name);  // Save name to localStorage
    setPlayerName(name);  // Set player name using context
    socket.emit("player-join", name);  // Emit to server
  };

  // Redirect when game starts and step is updated
  useEffect(() => {
    if (step >= 0 && gameMode) {
      navigate(`/play/${gameMode}`);
    }
  }, [step, gameMode, navigate]);

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
