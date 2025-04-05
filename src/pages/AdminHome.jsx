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
    <div className="min-h-screen flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-4xl font-bold mb-6">💘 Choose Your Game Mode</h1>
      <div className="space-x-4">
        <button
          onClick={() => startGame("majority")}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-xl text-xl"
        >
          💬 Majority Rules
        </button>
        <button
          onClick={() => startGame("kahoot")}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xl text-xl"
        >
          ❓ Kahoot Style
        </button>
      </div>
    </div>
  );
}
