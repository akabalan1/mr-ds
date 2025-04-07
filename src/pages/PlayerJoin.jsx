// src/pages/PlayerJoin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, mode, step } = useGame();

  useEffect(() => {
    if (step === -1) {
      localStorage.removeItem("playerName");
    }
  }, [step]);

  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);
      socket.emit("player-join", stored);
      navigate("/waiting");
    }
  }, [setPlayerName, socket, navigate]);

  const handleJoin = () => {
    console.log("🚀 Emitting player-join for:", name);
    if (!name.trim()) return;
    localStorage.removeItem("playerName");
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    socket.emit("player-join", name);
    navigate("/waiting");
  };

  return (
    <Layout showAdminLink={false}>
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
</Layout>
  );
}
