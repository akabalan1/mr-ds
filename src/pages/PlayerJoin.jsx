
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, gameMode, step } = useGame();

  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);
      socket.emit("player-join", stored);
    }
  }, []);

  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    socket.emit("player-join", name);
  };

  useEffect(() => {
    if (step >= 0 && gameMode) {
      navigate(`/play/${gameMode}`);
    }
  }, [step, gameMode, navigate]);

  return (
    <div className="player-join">
      <h1>👋 Enter Your Name</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name..."
      />
      <button onClick={handleJoin}>Join Game</button>
    </div>
  );
}
