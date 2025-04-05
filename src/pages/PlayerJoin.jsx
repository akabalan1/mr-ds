// src/pages/PlayerJoin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function PlayerJoin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { socket, setPlayerName, mode, step } = useGame();

  // If the game has been reset, send the player back to the join page.
  useEffect(() => {
    if (step === -1) {
      navigate("/join");
    }
  }, [step, navigate]);

  // Restore player name from localStorage if available,
  // then join the game and navigate to a waiting screen.
  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      setPlayerName(stored);
      socket.emit("player-join", stored);
      navigate("/waiting");
    }
  }, [setPlayerName, socket, navigate]);

  // Handle player name input and joining
  const handleJoin = () => {
    if (!name.trim()) return;
    localStorage.setItem("playerName", name);
    setPlayerName(name);
    socket.emit("player-join", name);
    navigate("/waiting"); // Navigate to waiting screen immediately after joining
  };

  // If the game starts (step becomes >= 0 and mode is set), navigate to the play route.
  useEffect(() => {
    if (step >= 0 && mode) {
      navigate(`/play/${mode}`);
    }
  }, [step, mode, navigate]);

  // Inline styles for this component
  const containerStyle = {
    padding: "1.5rem",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const inputStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "0.5rem",
    marginRight: "0.5rem",
    fontSize: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb", // Blue
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
  };

  return (
    <Layout showAdminLink={false}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>👋 Enter Your Name</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          style={inputStyle}
        />
        <button onClick={handleJoin} style={buttonStyle}>
          Join Game
        </button>
      </div>
    </Layout>
  );
}
