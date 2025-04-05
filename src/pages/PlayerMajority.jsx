// src/pages/PlayerMajority.jsx
import React, { useEffect } from "react";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function PlayerMajority() {
  const { socket, questions, questionIndex, step, mode } = useGame();
  const navigate = useNavigate();

  const handleVote = (option) => {
    socket.emit("submitVote", {
      name: localStorage.getItem("playerName"),
      option,
      questionIndex,
    });
  };

  useEffect(() => {
    if (step === "done" && mode === "majority") {
      navigate("/results");
    }
  }, [step, mode, navigate]);

  return (
    <Layout showAdminLink={false}>
      <div style={{ marginTop: "1rem" }}>
        {questions[questionIndex] ? (
          <div>
            <h2>
              Q{questionIndex + 1}: {questions[questionIndex].question}
            </h2>
            <ul>
              {questions[questionIndex].options.map((option, i) => (
                <li key={i}>
                  <button onClick={() => handleVote(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Waiting for the game to start...</p>
        )}
      </div>
    </Layout>
  );
}
