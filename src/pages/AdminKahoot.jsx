import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";


export default function AdminKahoot() {
  const {
  socket,
  players,
  leaderboard,
  step,
  setStep,
  resetGame,
  votes,
  kahootAnswers,
} = useGame();

  const [questions] = useState([
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    question: "What is the capital of France?",
    options: ["Rome", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
    {
    question: "What is the capital of France?",
    options: ["Rome", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    question: "What is the capital of France?",
    options: ["Rome", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
]);

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
    setFinalVotes(votes); // ✅ This now contains the vote summary per player
    setResultsVisible(true);
  }
}, [timer, kahootAnswers, step, currentQuestionIndex]);


  const handleStartGame = () => {
    setStep(0);
    socket.emit("gameStart", { questions, gameMode: "kahoot" });
  };

  const handleNextQuestion = () => {
  // Delay score calculation to allow vote chart to display
  setTimeout(() => {
    socket.emit("calculateKahootScores");
    setResultsVisible(false);
    setFinalVotes({}); // 🧼 Clear votes before next question

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setStep(nextIndex);
    } else {
      setStep("done");
    }
  }, 3000); // ⏱️ Give 3s to display the chart before moving on
};


  const handleReset = () => {
  resetGame();                      // reset server state
  setCurrentQuestionIndex(0);      // reset local question index
  setFinalVotes({});               // clear votes
  setStep(-1);                     // reset game flow
  setResultsVisible(false);        // hide chart
  localStorage.removeItem("playerName"); // 🧼 clear player name like AdminMajority
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
    <p style={{ color: "gray", marginBottom: "1rem" }}>⏳ Time remaining: {timer}s</p>

    {currentQuestion.rapidFire ? (
      <ul style={{ listStyle: "none", padding: 0, display: "flex", justifyContent: "center", gap: "2rem" }}>
        {currentQuestion.options.map((option, i) => (
          <li key={i} style={{ textAlign: "center" }}>
            <div className="flex flex-col items-center">
              <img
                src={option === "Sarah" ? "/sarah.png" : "/danish.png"}
                alt={option}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <span style={{ marginTop: "0.5rem", fontWeight: "bold" }}>{option}</span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <ul style={{ listStyle: "disc", paddingLeft: "1.5rem", textAlign: "left" }}>
        {currentQuestion.options.map((option, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>{option}</li>
        ))}
      </ul>
    )}
  </>
)}



          {step !== "done" && (
  <>
    <h2>Answer Tally:</h2>
    {players.map((player, index) => (
      <p key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {player.name}
        {votes?.[player.name] ? (
            <span style={{ color: "green" }}>✅</span>
          ) : (
            <span style={{ color: "gray" }}>⌛</span>
          )}
      </p>
    ))}
  </>
)}

        </div>

        <div className="admin-section">

          {resultsVisible && Object.keys(finalVotes).length > 0 && step !== "done" && (
  <>
    <h2>Live Answer Breakdown</h2>
    <VoteChart votes={finalVotes} question={currentQuestion} />
  </>
)}


          {(typeof step === "number" && step >= 1) || step === "done" ? (
            <>
             <h2>Leaderboard:</h2>
{leaderboard.length > 0 ? (
  leaderboard.map((player, index) => {
    const emoji =
      index === 0 ? "👑" :
      index === 1 ? "🥈" :
      index === 2 ? "🥉" :
      index >= leaderboard.length - 3 ? "😞" : "";
    return (
      <p key={index}>
        {emoji} {index + 1}. {player.name}: {player.score} points
      </p>
    );
  })
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
