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
  console.log("Waiting page: step =", step, "mode =", mode, "prevStep =", prevStep.current);

  const storedName = localStorage.getItem("playerName");

  if (!storedName && step === -1) {
    navigate("/join");
  } else if (step >= 0 && mode) {
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
