import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const { setStep, socket } = useGame();
  const [questions] = useState([
    { question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], correctAnswer: "Paris" },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Fitzgerald"], correctAnswer: "Shakespeare" },
    { question: "What is 5 + 7?", options: ["10", "12", "14", "15"], correctAnswer: "12" },
  ]);

  const handleStartGame = () => {
    setStep(1); // Start the game (move to the first question)
    socket.emit("gameStart", questions);
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>
      <button onClick={handleStartGame} className="game-mode-btn bg-green-600 text-white p-3 rounded">
        Start Kahoot Game
      </button>

      {/* Placeholder Questions */}
      <div className="mt-6">
        <h2 className="font-bold">Questions:</h2>
        {questions.map((q, index) => (
          <div key={index}>
            <p><strong>Q{index + 1}: </strong>{q.question}</p>
            <ul>
              {q.options.map((option, i) => (
                <li key={i}>{option}</li>
              ))}
            </ul>
            <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
