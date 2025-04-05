// src/pages/AdminMajority.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminMajority() {
  const { socket, resetGame, setStep, players, step } = useGame();

  // Define questions for Majority Rules
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

  // Track the current question index and whether the game has started
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentVotes, setCurrentVotes] = useState({});

  // Button styling
  const buttonBase = {
    margin: "0.5rem",
    padding: "0.5rem 1rem",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const startButtonStyle = {
    ...buttonBase,
    backgroundColor: "#10b981", // Green
  };
  const nextButtonStyle = {
    ...buttonBase,
    backgroundColor: "#3b82f6", // Blue
  };
  const resetButtonStyle = {
    ...buttonBase,
    backgroundColor: "#dc2626", // Red
  };

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

  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
    setStep(0); // First question index = 0
    socket.emit("gameStart", { questions, gameMode: "majority" });
  };

  // Move to the next question
  const handleNextQuestion = () => {
    // Calculate majority scores on the server
    socket.emit("calculateMajorityScores");

    // If there are more questions, go to the next one
    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setStep(nextQuestionIndex);
      socket.emit("nextQuestion", nextQuestionIndex);
    } else {
      // No more questions: mark the game as done
      setStep("done");
    }
  };

  // Reset the game
  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    setGameStarted(false);
    localStorage.removeItem("playerName");
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <div style={{ margin: "1rem 0" }}>
        {/* Show START button if the game has not started */}
        {!gameStarted && (
          <button onClick={handleStartGame} style={startButtonStyle}>
            Start Majority Rules
          </button>
        )}

        {/* Show NEXT QUESTION button only after game starts */}
        {gameStarted && typeof step === "number" && step >= 0 && step !== "done" && (
          <button onClick={handleNextQuestion} style={nextButtonStyle}>
            Next Question
          </button>
        )}

        {/* Reset button is always visible */}
        <button onClick={handleResetGame} style={resetButtonStyle}>
          Reset Game
        </button>
      </div>

      {/* Show the current question only if the game has started and step >= 0 */}
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

      {/* Show the leaderboard starting from the second question (step >= 1) or if the game is done */}
      {gameStarted && ((typeof step === "number" && step >= 1) || step === "done") && (
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
