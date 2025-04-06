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
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <h1>👋 Enter Your Name</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button
          onClick={handleJoin}
          style={{ backgroundColor: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", border: "none", cursor: "pointer" }}
        >
          Join Game
        </button>
      </div>
    </Layout>
  );
}
