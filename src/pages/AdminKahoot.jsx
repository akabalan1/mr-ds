import React, { useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const { socket, resetGame, setStep, players, step } = useGame();
  const [questions] = useState([
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Rome", "Berlin"],
      correctAnswer: "Paris",
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Shakespeare", "Dickens", "Hemingway", "Fitzgerald"],
      correctAnswer: "Shakespeare",
    },
    {
      question: "What is 5 + 7?",
      options: ["10", "12", "14", "15"],
      correctAnswer: "12",
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Shared button style
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

  const handleStartGame = () => {
    setGameStarted(true);
    setStep(0); // Start at question index 0
    socket.emit("gameStart", { questions, gameMode: "kahoot" });
    socket.emit("startTimer");
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setStep(nextQuestionIndex);
      socket.emit("nextQuestion", nextQuestionIndex);
      socket.emit("startTimer");
    } else {
      setStep("done");
    }
  };

  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    setGameStarted(false);
    localStorage.removeItem("playerName");
  };

  const displayLeaderboard = () => {
    return players
      .slice()
      .sort((a, b) => b.score - a.score)
      .map((player, index) => (
        <p key={index}>
          {player.name}: {player.score} points
        </p>
      ));
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>
      <div style={{ margin: "1rem 0" }}>
        {!gameStarted && (
          <button onClick={handleStartGame} style={startButtonStyle}>
            Start Kahoot Game
          </button>
        )}
        {gameStarted && typeof step === "number" && step >= 0 && step !== "done" && (
          <button onClick={handleNextQuestion} style={nextButtonStyle}>
            Next Question
          </button>
        )}
        <button onClick={handleResetGame} style={resetButtonStyle}>
          Reset Game
        </button>
      </div>

      {gameStarted && typeof step === "number" && step >= 0 && step !== "done" && (
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
      )}

      <div style={{ marginTop: "1rem" }}>
        <h2>Players Joined:</h2>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>

      {gameStarted && ((typeof step === "number" && step >= 1) || step === "done") && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Leaderboard:</h2>
          {displayLeaderboard()}
        </div>
      )}
    </Layout>
  );
}
