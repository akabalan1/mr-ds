import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, gameMode, step } = useGame();

  // Restore player name from localStorage if available
  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);
      if (socket) socket.emit("player-join", stored);
    }
  }, [socket]);

  const handleJoin = () => {
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    if (socket) socket.emit("player-join", name);
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
