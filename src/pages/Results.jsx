// src/pages/Results.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Results() {
  const { players, resetGame, setStep, step } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === -1) {
      localStorage.removeItem("playerName");
      navigate("/join");
    }
  }, [step, navigate]);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const handlePlayAgain = () => {
    resetGame();
    setStep(-1);
    navigate("/join");
  };

  return (
    <Layout>
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <h1>Game Over</h1>
        <h2>Final Leaderboard</h2>
        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <p key={index}>
              {index + 1}. {player.name}: {player.score} points
            </p>
          ))
        ) : (
          <p>No players joined.</p>
        )}
        <button
          onClick={handlePlayAgain}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Play Again
        </button>
      </div>
    </Layout>
  );
}
