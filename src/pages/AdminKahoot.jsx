// src/pages/AdminKahoot.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const { socket, resetGame, setStep, players } = useGame();
  // Define questions locally (for Kahoot)
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

  // Start the Kahoot game: send questions and set game mode
  const handleStartGame = () => {
    setStep(0); // start at question 0
    socket.emit("gameStart", { questions, gameMode: "kahoot" });
    socket.emit("startTimer");
  };

  // Move to the next question
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

  // Reset the game
  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    localStorage.removeItem("playerName");
  };

  // Leaderboard display
  const displayLeaderboard = () => {
    return players.map((player, index) => (
      <div key={index}>
        <p>{player.name}: {player.score} points</p>
      </div>
    ));
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>
      <button onClick={handleStartGame} style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}>
        Start Kahoot Game
      </button>
      <button onClick={handleNextQuestion} style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}>
        Next Question
      </button>
      <button onClick={handleResetGame} style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}>
        Reset Game
      </button>

      <div style={{ marginTop: "1rem" }}>
        <h2>Current Question:</h2>
        {questions[currentQuestion] && (
          <div>
            <p><strong>Q{currentQuestion + 1}:</strong> {questions[currentQuestion].question}</p>
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
          {displayLeaderboard()}
        </div>
      )}
    </Layout>
  );
}
