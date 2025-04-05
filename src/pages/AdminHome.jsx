
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
      <h1>💘 Choose Your Game Mode</h1>
      <div>
        <button onClick={() => startGame("majority")}>💬 Majority Rules</button>
        <button onClick={() => startGame("kahoot")}>❓ Kahoot Style</button>
      </div>
    </div>
  );
}
