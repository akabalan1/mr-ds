// src/pages/Results.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Results() {
  const { leaderboard, resetGame, setStep, step, mode } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === -1) {
      localStorage.removeItem("playerName");
      navigate("/join");
    }
  }, [step, navigate]);

  const sortedPlayers = leaderboard || [];

  const handlePlayAgain = () => {
    resetGame();
    setStep(-1);
    navigate("/join");
  };

  const getEmoji = (index, total) => {
    if (index < 3) return "🏆"; // Top 3
    if (total > 3 && index >= total - 3) return "😞"; // Bottom 3
    return "";
  };

  return (
    <Layout>
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <h1>Game Over</h1>
        <h2>
          {mode === "kahoot" ? "🏁 Kahoot Leaderboard" : "🏁 Majority Rules Leaderboard"}
        </h2>

        {sortedPlayers.length > 0 ? (
          sortedPlayers.map((player, index) => (
            <p key={index} style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {index + 1}. {player.name}: {player.score} pts{" "}
              <span style={{ marginLeft: "0.5rem" }}>
                {getEmoji(index, sortedPlayers.length)}
              </span>
            </p>
          ))
        ) : (
          <p>No players joined.</p>
        )}

        <button
          onClick={handlePlayAgain}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2563eb",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Play Again
        </button>
      </div>
    </Layout>
  );
}
