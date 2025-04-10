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

  // 🧨 Case: Trying to reach /waiting without a name
  if (!storedName || storedName.trim() === "") {
    navigate("/join");
    return;
  }

  // 🔁 Case: Game was reset while on /waiting → go back to /join
  if (step === -1 && prevStep.current !== -1) {
    navigate("/join");
    return;
  }

  // 🚀 Case: Game started — go to the proper game mode
  if (typeof step === "number" && step >= 0) {
    if (mode === "kahoot") {
      navigate("/play/kahoot");
    } else if (mode === "majority") {
      navigate("/play/majority");
    }
    return;
  }

  // ✅ Track previous step to detect resets
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
