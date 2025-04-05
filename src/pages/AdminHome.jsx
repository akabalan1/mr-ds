
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";

export default function AdminHome() {
  const navigate = useNavigate();
  const { changeMode, resetGame } = useGame();

  const startGame = (mode) => {
    changeMode(mode);
    resetGame();
    navigate(`/admin/${mode}`);
  };

  return (
    <div className="admin-home">
      <h1 className="text-4xl font-extrabold mb-6">💘 Choose Your Game Mode</h1>
      <div>
        <button onClick={() => startGame("majority")} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xl text-xl transition duration-300">💬 Majority Rules</button>
        <button onClick={() => startGame("kahoot")} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl text-xl transition duration-300">❓ Kahoot Style</button>
      </div>
    </div>
  );
}
