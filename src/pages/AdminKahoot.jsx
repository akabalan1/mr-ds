import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const { gameMode, step, setStep, setPlayers, socket, resetGame, players } = useGame();
  const [questions] = useState([
    { question: "What is the capital of France?", options: ["Paris", "London", "Rome", "Berlin"], correctAnswer: "Paris" },
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Fitzgerald"], correctAnswer: "Shakespeare" },
    { question: "What is 5 + 7?", options: ["10", "12", "14", "15"], correctAnswer: "12" },
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Start the Kahoot game
  const handleStartGame = () => {
    setStep(1);  // Start the game (move to the first question)
    socket.emit("gameStart", questions);
    socket.emit("startTimer"); // Start the timer for the first question
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setStep(currentQuestion + 1);
      socket.emit("nextQuestion", currentQuestion + 1);  // Move to the next question
      socket.emit("startTimer"); // Start the timer for the next question
    } else {
      setStep("done");  // End the game after the last question
    }
  };

  // Handle the game reset
  const handleResetGame = () => {
    resetGame();  // Call reset function to reset the game
    setStep(-1);  // Reset the step to the initial state
    setCurrentQuestion(0);  // Reset the current question index to 0
  };

  // Display the current score/leaderboard (you can add this part as needed)
  const displayLeaderboard = () => {
    // Example of displaying leaderboard after each question
    return players.map((player, index) => (
      <div key={index}>
        <p>{player.name}: {player.points} points</p>
      </div>
    ));
  };

  return (
    <Layout>
      <h1>Admin Kahoot Game</h1>

      {/* Start Game Button */}
      <button onClick={handleStartGame} className="game-mode-btn bg-green-600 text-white p-3 rounded">
        Start Kahoot Game
      </button>

      {/* Next Question Button */}
      <button onClick={handleNextQuestion} className="game-mode-btn bg-blue-600 text-white p-3 rounded mt-4">
        Next Question
      </button>

      {/* Reset Game Button */}
      <button onClick={handleResetGame} className="game-mode-btn bg-red-600 text-white p-3 rounded mt-4">
        Reset Game
      </button>

      {/* Display Questions */}
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

      {/* Display Leaderboard */}
      <div className="mt-6">
        <h2 className="font-bold">Leaderboard:</h2>
        {displayLeaderboard()}
      </div>
    </Layout>
  );
}
