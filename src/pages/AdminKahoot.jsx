
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext"; 

export default function AdminKahoot() {
  const { gameMode, step, setStep, socket } = useGame();
  
  const startTimer = () => {
    setStep(1);  // Start the game
    socket.emit("startTimer");
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>
      <button onClick={startTimer}>Start Timer</button>
      {/* Kahoot-related content */}
    </Layout>
  );
}
