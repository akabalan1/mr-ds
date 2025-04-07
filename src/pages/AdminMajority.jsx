// src/pages/AdminMajority.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";

export default function AdminMajority() {
  const { socket, resetGame, setStep, players, step } = useGame();

  const [questions] = useState([
    {
      question: "What is your favorite color?",
      options: ["Red", "Blue", "Green", "Yellow"],
    },
    {
      question: "What is the best type of music?",
      options: ["Rock", "Pop", "Classical", "Jazz"],
    },
    {
      question: "What is your favorite fruit?",
      options: ["Apple", "Banana", "Orange", "Grapes"],
    },
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentVotes, setCurrentVotes] = useState({});
  const [finalVotes, setFinalVotes] = useState({});
  const [voteCount, setVoteCount] = useState(0);
  const [timer, setTimer] = useState(10);
  const [resultsVisible, setResultsVisible] = useState(false);

  const buttonBase = {
    margin: "0.5rem",
    padding: "0.5rem 1rem",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const startButtonStyle = { ...buttonBase, backgroundColor: "#10b981" };
  const nextButtonStyle = { ...buttonBase, backgroundColor: "#3b82f6" };
  const resetButtonStyle = { ...buttonBase, backgroundColor: "#dc2626" };

  useEffect(() => {
    if (socket) {
      socket.on("updateVotes", (newVotes) => {
        setCurrentVotes(newVotes);
        setVoteCount(Object.keys(newVotes).length);
      });
      return () => {
        socket.off("updateVotes");
      };
    }
  }, [socket]);

  useEffect(() => {
    if (typeof step !== "number" || step === "done") return;
    setTimer(10);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [step]);

  useEffect(() => {
    if (timer === 0 && typeof step === "number" && step >= 0 && step !== "done") {
      setFinalVotes({ ...currentVotes });
      setResultsVisible(true);
    }
  }, [timer, currentVotes, step]);

  const handleStartGame = () => {
    setStep(0);
    setResultsVisible(false);
    socket.emit("gameStart", { questions, gameMode: "majority" });
  };

  const handleNextQuestion = () => {
    socket.emit("calculateMajorityScores");
    setResultsVisible(false);

    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setStep(nextQuestionIndex);
    } else {
      setStep("done");
    }
  };

  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    setFinalVotes({});
    setResultsVisible(false);
    localStorage.removeItem("playerName");
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <div style={{ margin: "1rem 0" }}>
        {step === -1 && (
          <button onClick={handleStartGame} style={startButtonStyle}>
            Start Majority Rules
          </button>
        )}

        {typeof step === "number" && step >= 0 && step !== "done" && (
          <button
            onClick={handleNextQuestion}
            disabled={timer > 0 || !resultsVisible}
            style={nextButtonStyle}
          >
            {currentQuestion === questions.length - 1 ? "Finish Game" : "Next Question"}
          </button>
        )}

        <button onClick={handleResetGame} style={resetButtonStyle}>
          Reset Game
        </button>
      </div>

      {typeof step === "number" && step >= 0 && step !== "done" && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Current Question:</h2>
          {questions[currentQuestion] && (
            <div>
              <p>
                <strong>Q{currentQuestion + 1}:</strong> {questions[currentQuestion].question}
              </p>
              <p style={{ color: "gray" }}>⏳ Time remaining: {timer}s</p>
              <ul>
                {questions[currentQuestion].options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {resultsVisible && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Live Vote Distribution</h2>
          <VoteChart votes={finalVotes} question={questions[currentQuestion]} />
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <h2>Players Joined:</h2>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>

      {(typeof step === "number" && step >= 1) || step === "done" ? (
        <div style={{ marginTop: "1rem" }}>
          <h2>Leaderboard:</h2>
          {players
            .slice()
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <p key={index}>
                {player.name}: {player.score} points
              </p>
            ))}
        </div>
      ) : null}
    </Layout>
  );
}
