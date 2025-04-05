import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";

export default function Waiting() {
  const { step, mode } = useGame();
  const navigate = useNavigate();

  // Automatically navigate to the game page when the game starts.
  useEffect(() => {
    if (step >= 0 && mode) {
      navigate(`/play/${mode}`);
    }
  }, [step, mode, navigate]);

  // Inline styles for this component
  const containerStyle = {
    padding: "1.5rem",
    textAlign: "center",
  };

  const headingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const paragraphStyle = {
    fontSize: "1.2rem",
  };

  return (
    <Layout showAdminLink={false}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>Waiting for the game to start...</h1>
        <p style={paragraphStyle}>
          You have successfully joined the game. Please wait for the admin to start the game.
        </p>
      </div>
    </Layout>
  );
}
