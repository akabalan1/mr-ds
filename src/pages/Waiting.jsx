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

    // ✅ Kick player out ONLY if step transitioned from non -1 to -1 (i.e. game reset)
    if (step === -1 && prevStep.current !== -1) {
      console.log("[Waiting.jsx] Game was reset — returning to join");
      localStorage.removeItem("playerName");
      navigate("/join");
      return;
    }

    // ✅ Stay on waiting if game hasn't started yet
    // ✅ Once game starts, redirect player to the right game mode
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
