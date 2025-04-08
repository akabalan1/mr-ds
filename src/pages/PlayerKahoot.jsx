// src/pages/PlayerKahoot.jsx
import React, { useEffect, useState } from "react";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function PlayerKahoot() {
  const { socket, questions, questionIndex, step, mode, playerName, submitKahootAnswer } = useGame();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(15);
  const [locked, setLocked] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
if (step === -1 && (!storedName || storedName.trim() === "")) {
  navigate("/join");
}

    if (step === "done" && mode === "kahoot") {
      navigate("/results");
      return;
    }

    setSubmitted(false);
    setSelectedOption(null);
    setLocked(false);
    setStartTime(Date.now());
    setTimer(15);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setLocked(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [step, mode, navigate]);

  const handleAnswer = (option) => {
    if (locked || submitted) return;

    const name = playerName || localStorage.getItem("playerName");
    if (!name || name.trim() === "") {
      console.warn("🚫 No player name found when answering");
      return;
    }

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const answerTime = Math.max(0, 15 - elapsed);

    setSelectedOption(option);
    setSubmitted(true);
    submitKahootAnswer(name, option, answerTime);
  };

  const currentQuestion = questions[questionIndex];
  const correctAnswer = currentQuestion?.correctAnswer;


  return (
    <Layout showAdminLink={false}>
      <div className="player-mobile">
        {currentQuestion ? (
          <div>
            <h2>
              Q{questionIndex + 1}: {currentQuestion.question}
            </h2>

            <div
              style={{
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                color: timer <= 3 ? "red" : "gray",
                fontWeight: timer <= 3 ? "bold" : "normal",
              }}
            >
              ⏳ Time left: {timer}s
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {currentQuestion.options.map((option, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <button
  onClick={() => handleAnswer(option)}
  disabled={locked || submitted}
  className="player-button"
  style={{
  backgroundColor:
    locked && selectedOption === option && option !== correctAnswer
      ? "#ef4444" // ❌ red for wrong selection
      : locked && option === correctAnswer
      ? "#10b981" // ✅ green for correct answer
      : selectedOption === option
      ? "#3b82f6" // highlight selected before lock
      : "#fff",
  color:
    locked && (option === correctAnswer || selectedOption === option)
      ? "#fff"
      : "#000",
  fontWeight:
    locked && (option === correctAnswer || selectedOption === option)
      ? "bold"
      : "normal",
  border: "1px solid #ccc",
  transition: "all 0.3s ease",
}}

>
  {option}
</button>

                </li>
              ))}
            </ul>

            {submitted && (
              <p style={{ color: "#10b981", fontWeight: "bold" }}>
                ✅ Answer submitted!
              </p>
            )}
            {locked && !submitted && (
              <p style={{ color: "#f97316", fontWeight: "bold" }}>
                ⌛ Time's up! You didn't answer in time.
              </p>
            )}
          </div>
        ) : (
          <p>Waiting for the game to start...</p>
        )}
      </div>
    </Layout>
  );
}
