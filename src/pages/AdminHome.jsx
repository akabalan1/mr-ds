import React from "react";
import Layout from "../components/Layout"; // Import Layout component
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export default function AdminHome() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleMajorityGame = () => {
    navigate("/admin/majority"); // Navigate to the Majority Rules game setup
  };

  const handleKahootGame = () => {
    navigate("/admin/kahoot"); // Navigate to the Kahoot game setup
  };

  return (
    <Layout>
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
          className="game-mode-btn bg-green-600 text-white p-3 rounded"
        >
          Start Kahoot Game
        </button>
      </div>
    </Layout>
  );
}
