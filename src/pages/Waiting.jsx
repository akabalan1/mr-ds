// src/pages/Waiting.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Waiting() {
  const { step, mode } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (step >= 0 && mode) {
      if (mode === "kahoot") {
        navigate("/play/kahoot");
      } else if (mode === "majority") {
        navigate("/play/majority");
      }
    }
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
