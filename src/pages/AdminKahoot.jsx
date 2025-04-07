import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";

export default function AdminKahoot() {
  const {
    socket,
    players,
    leaderboard,
    questions,
    step,
    setStep,
    resetGame,
    votes,
  } = useGame();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalVotes, setFinalVotes] = useState({});
  const [timer, setTimer] = useState(15);
  const [resultsVisible, setResultsVisible] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (typeof step === "number" && step >= 0 && step !== "done") {
      setTimer(15);
      setResultsVisible(false);
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
    }
  }, [step]);

  useEffect(() => {
    if (timer === 0 && typeof step === "number") {
      setFinalVotes(votes);
      setResultsVisible(true);
    }
  }, [timer, votes, step]);

  const handleStartGame = () => {
    setStep(0);
    socket.emit("gameStart", { questions, gameMode: "kahoot" });
  };

  const handleNextQuestion = () => {
    socket.emit("calculateKahootScores");
    setResultsVisible(false);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setStep(nextIndex);
    } else {
      setStep("done");
    }
  };

  const handleReset = () => {
    resetGame();
    setCurrentQuestionIndex(0);
    setStep(-1);
  };

  return (
    <Layout>
      <h1>Admin Kahoot Mode</h1>

      <div className="admin-controls">
        {step === -1 && (
          <button onClick={handleStartGame} className="game-mode-btn bg-green-600">
            Start Kahoot Game
          </button>
        )}

        {typeof step === "number" && step >= 0 && step !== "done" && (
          <button
            onClick={handleNextQuestion}
            disabled={timer > 0 || !resultsVisible}
            className="game-mode-btn bg-blue-600"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Game" : "Next Question"}
          </button>
        )}

        <button onClick={handleReset} className="game-mode-btn bg-red-600">
          Reset Game
        </button>
      </div>

      <div className="admin-panel">
        <div className="admin-section">
          {typeof step === "number" && step >= 0 && step !== "done" && currentQuestion && (
            <>
              <h2>Current Question:</h2>
              <p>
                <strong>Q{currentQuestionIndex + 1}:</strong> {currentQuestion.question}
              </p>
              <p style={{ color: "gray" }}>⏳ Time remaining: {timer}s</p>
              <ul>
                {currentQuestion.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </>
          )}

          {step !== "done" && (
            <>
              <h2>Players:</h2>
              {players.map((player, index) => (
                <p key={index}>{player.name}</p>
              ))}
            </>
          )}
        </div>

        <div className="admin-section">
          {resultsVisible && step !== "done" && (
            <>
              <h2>Live Vote Distribution</h2>
              <VoteChart votes={finalVotes} question={currentQuestion} />
            </>
          )}

          {(typeof step === "number" && step >= 1) || step === "done" ? (
            <>
              <h2>Leaderboard:</h2>
              {leaderboard.length > 0 ? (
                leaderboard.map((player, index) => (
                  <p key={index}>
                    {index + 1}. {player.name}: {player.score} points
                  </p>
                ))
              ) : (
                <p>No players to show.</p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}
