// src/pages/Waiting.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Waiting() {
  const { step, mode } = useGame();
  const navigate = useNavigate();
  const prevStep = useRef(step);

  useEffect(() => {
  const storedName = localStorage.getItem("playerName");
  console.log("⌛ [Waiting] step =", step, "| mode =", mode, "| storedName =", storedName);

  // ✅ Go back to join if:
  // 1. No playerName OR
  // 2. Game was reset (step = -1) AFTER player joined
  const gameWasReset = step === -1 && prevStep.current !== -1;
  const missingName = !storedName || storedName.trim() === "";

  if (gameWasReset || missingName) {
    console.log("[Waiting.jsx] Game was reset or anonymous — returning to join");
    navigate("/join");
    return;
  }

  // ✅ If the game starts, send player to correct mode
  if (typeof step === "number" && step >= 0) {
    if (mode === "kahoot") {
      navigate("/play/kahoot");
    } else if (mode === "majority") {
      navigate("/play/majority");
    }
  }

  prevStep.current = step;
}, [step, mode, navigate]);



  return (
    <Layout showAdminLink={false}>
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <h1>Waiting for the game to start...</h1>
        <p>You have successfully joined the game. Please wait for the admin to start the game.</p>
      </div>
    </Layout>
  );
}
