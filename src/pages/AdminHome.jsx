import React from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function AdminHome() {
  const navigate = useNavigate();
  const { resetGame, setStep } = useGame();

  const handleMajorityGame = () => {
    navigate("/admin/majority");
  };

  const handleKahootGame = () => {
    navigate("/admin/kahoot");
  };

  // Reset the game: emit reset event, reset local state, and clear player local storage
  const handleResetGame = () => {
    resetGame(); // Emit reset event to the server
    setStep(-1); // Reset the step to the initial state
    localStorage.removeItem("playerName"); // Clear player's local storage
    console.log("Game reset");
  };

  return (
    <Layout>
      <div className="admin-home">
        <h1 className="text-3xl font-bold mb-4">👋 Welcome to Admin Home</h1>
        <div className="mt-6">
          <button
            onClick={handleMajorityGame}
            className="game-mode-btn bg-blue-600 text-white p-3 rounded mb-4"
          >
            Start Majority Rules Game
          </button>
          <button
            onClick={handleKahootGame}
            className="game-mode-btn bg-green-600 text-white p-3 rounded mb-4"
          >
            Start Kahoot Game
          </button>
          <button
            onClick={handleResetGame}
            className="game-mode-btn bg-red-600 text-white p-3 rounded"
          >
            Reset Game
          </button>
        </div>
      </div>
    </Layout>
  );
}
