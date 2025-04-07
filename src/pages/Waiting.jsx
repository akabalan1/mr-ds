// src/pages/Waiting.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Waiting() {
  const { step, mode, socket } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    console.log("⌛ [Waiting] step =", step, "| mode =", mode, "| storedName =", storedName);

    // 🚨 Redirect to /join if no name (e.g. refresh or bug)
    if (!storedName || storedName.trim() === "") {
      console.log("⚠️ [Waiting] No player name found — redirecting to /join");
      navigate("/join");
      return;
    }

    // ✅ Redirect to game page once the game starts
    if (typeof step === "number" && step >= 0) {
      if (mode === "kahoot") {
        navigate("/play/kahoot");
      } else if (mode === "majority") {
        navigate("/play/majority");
      }
    }

    // ✅ Listen for admin reset
    const handleReset = () => {
      console.log("🧹 [Waiting] gameReset received — redirecting to /join");
      localStorage.removeItem("playerName");
      navigate("/join");
    };

    socket.on("gameReset", handleReset);
    return () => socket.off("gameReset", handleReset);
  }, [step, mode, navigate, socket]);

  return (
    <Layout showAdminLink={false}>
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <h1>Waiting for the game to start...</h1>
        <p>You have successfully joined the game. Please wait for the admin to start the game.</p>
      </div>
    </Layout>
  );
}
