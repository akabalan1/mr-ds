// src/pages/PlayerKahoot.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import { useNavigate } from "react-router-dom";

export default function PlayerKahoot() {
  const { socket, questions, questionIndex, step, mode } = useGame();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on("timerUpdate", (timeRemaining) => {
        setTimer(timeRemaining);
      });
      return () => {
        socket.off("timerUpdate");
      };
    }
  }, [socket]);

  const handleAnswer = (answer) => {
    // For Kahoot: only correct answers earn points; faster answers earn more.
    const timeFactor = Math.max(0, 10 - timer);
    socket.emit("submitKahoot", {
      name: localStorage.getItem("playerName"),
      option: answer,
      time: timeFactor,
      questionIndex,
    });
  };

  useEffect(() => {
    if (step === "done" && mode === "kahoot") {
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
                  <button onClick={() => handleAnswer(option)}>
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            <p>Time remaining: {timer} seconds</p>
          </div>
        ) : (
          <p>Waiting for the game to start...</p>
        )}
      </div>
    </Layout>
  );
}
