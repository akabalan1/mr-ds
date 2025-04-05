import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminMajority() {
  const { setStep, socket } = useGame();
  const [questions] = useState([
    { question: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { question: "What is the best type of music?", options: ["Rock", "Pop", "Classical", "Jazz"] },
    { question: "What is your favorite fruit?", options: ["Apple", "Banana", "Orange", "Grapes"] },
  ]);

  const handleStartGame = () => {
    setStep(1); // Start the game (move to the first question)
    socket.emit("gameStart", questions);
  };

  return (
    <Layout>
      <h1>Admin Majority Rules Game</h1>
      <button onClick={handleStartGame} className="game-mode-btn bg-blue-600 text-white p-3 rounded">
        Start Majority Rules
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
          </div>
        ))}
      </div>
    </Layout>
  );
}
