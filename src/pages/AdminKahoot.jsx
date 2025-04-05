// src/pages/AdminKahoot.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const { socket, resetGame, setStep, players } = useGame();
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

  // Start the Kahoot game
  const handleStartGame = () => {
    setStep(1);
    socket.emit("gameStart", questions);
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

  // Handle the game reset
  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    localStorage.removeItem("playerName");
  };

  // Display leaderboard (players with points)
  const displayLeaderboard = () => {
    return players.map((player, index) => (
      <div key={index}>
        <p>{player.name}: {player.points} points</p>
      </div>
    ));
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>
      <button
        onClick={handleStartGame}
        className="game-mode-btn bg-green-600 text-white p-3 rounded"
      >
        Start Kahoot Game
      </button>
      <button
        onClick={handleNextQuestion}
        className="game-mode-btn bg-blue-600 text-white p-3 rounded mt-4"
      >
        Next Question
      </button>
      <button
        onClick={handleResetGame}
        className="game-mode-btn bg-red-600 text-white p-3 rounded mt-4"
      >
        Reset Game
      </button>

      <div className="mt-6">
        <h2 className="font-bold">Players Joined:</h2>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-bold">Leaderboard:</h2>
        {displayLeaderboard()}
      </div>

      <div className="mt-6">
        <h2 className="font-bold">Questions:</h2>
        {questions.map((q, index) => (
          <div key={index}>
            <p>
              <strong>Q{index + 1}: </strong>
              {q.question}
            </p>
            <ul>
              {q.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
            <p>
              <strong>Correct Answer:</strong> {q.correctAnswer}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
