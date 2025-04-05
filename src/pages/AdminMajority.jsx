// src/pages/AdminMajority.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminMajority() {
  const { socket, resetGame, setStep, players, step } = useGame(); // Added step here
  // Define questions locally (for Majority Rules)
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
  const [gameStarted, setGameStarted] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({});

  useEffect(() => {
    if (socket) {
      socket.on("updateVotes", (newVotes) => {
        setCurrentVotes(newVotes);
      });
      return () => {
        socket.off("updateVotes");
      };
    }
  }, [socket]);

  // Start Majority Rules game
  const handleStartGame = () => {
    setStep(0);
    setGameStarted(true);
    socket.emit("gameStart", { questions, gameMode: "majority" });
  };

  // Next question: calculate scores then advance
  const handleNextQuestion = () => {
    // Calculate majority scores on the server
    socket.emit("calculateMajorityScores");
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setStep(nextQuestionIndex);
      socket.emit("nextQuestion", nextQuestionIndex);
    } else {
      setStep("done");
    }
  };

  // Reset the game
  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    localStorage.removeItem("playerName");
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <button
        onClick={handleStartGame}
        style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
        disabled={gameStarted}
      >
        {gameStarted ? "Game Started" : "Start Majority Rules"}
      </button>
      <button
        onClick={handleNextQuestion}
        style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
      >
        Next Question
      </button>
      <button
        onClick={handleResetGame}
        style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
      >
        Reset Game
      </button>

      <div style={{ marginTop: "1rem" }}>
        <h2>Current Question:</h2>
        {questions[currentQuestion] && (
          <div>
            <p>
              <strong>Q{currentQuestion + 1}:</strong> {questions[currentQuestion].question}
            </p>
            <ul>
              {questions[currentQuestion].options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Players Joined:</h2>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>

      {step === "done" && (
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
      )}
    </Layout>
  );
}
