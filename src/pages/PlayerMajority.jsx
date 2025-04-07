// src/pages/PlayerMajority.jsx
import React, { useEffect, useState } from "react";
import { useGame } from "../GameContext";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function PlayerMajority() {
  const { socket, questions, questionIndex, step, mode, playerName } = useGame();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(10);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (step === -1) {
      localStorage.removeItem("playerName");
      navigate("/join");
    }

    if (step === "done" && mode === "majority") {
      navigate("/results");
      return;
    }

    // Reset state on new question
    setSubmitted(false);
    setSelectedOption(null);
    setLocked(false);
    setTimer(10);

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

  const handleVote = (option) => {
  if (locked || submitted) return;

  const name = playerName || localStorage.getItem("playerName");
  if (!name || name.trim() === "") {
    console.warn("🚫 No player name found when voting");
    return;
  }

  // Make sure GameContext knows the name if it wasn't already set
  if (!playerName || playerName !== name) {
    localStorage.setItem("playerName", name);
    setPlayerName(name); // sync context state
  }

  console.log("📤 Submitting vote for:", name);
  setSelectedOption(option);
  setSubmitted(true);

  console.log("🗳️ [PlayerMajority] submitting vote → name:", name, "| option:", option, "| step:", step);

  socket.emit("submitVote", {
    name,
    option,
    questionIndex,
  });
};



  const currentQuestion = questions[questionIndex];

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
                    onClick={() => handleVote(option)}
                    disabled={locked || submitted}
                    className="player-button"
                    style={{
                      backgroundColor:
                        selectedOption === option
                          ? "#10b981"
                          : locked || submitted
                          ? "#ccc"
                          : "#fff",
                      color:
                        selectedOption === option || locked
                          ? "#fff"
                          : "#000",
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
                ✅ Vote submitted!
              </p>
            )}
            {locked && !submitted && (
              <p style={{ color: "#f97316", fontWeight: "bold" }}>
                ⌛ Time's up! You didn't vote in time.
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
