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
    question: "Who said it: \"I cannot get the image of John twerking out of my head.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Are we still pretending this is innocent?\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"It’s not the thought, it’s the effort… or the technique.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalVotes, setFinalVotes] = useState({});
  const [timer, setTimer] = useState(15);
  const [resultsVisible, setResultsVisible] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (typeof step === "number" && step >= 0 && step !== "done") {
      setTimer(currentQuestion?.rapidFire ? 7 : 15);
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
  if (timer === 0 && typeof step === "number" && step >= 0 && step !== "done") {
    const delay = setTimeout(() => {
      console.log("📊 [Delayed] Timer expired, setting finalVotes. Step:", step, "Q:", currentQuestionIndex);
      console.log("📊 [Delayed] votes snapshot:", votes);
      setFinalVotes({ ...votes });
      setResultsVisible(true);
    }, 200); // Wait 200ms to ensure GameContext votes update first
    return () => clearTimeout(delay);
  }
}, [timer, votes, step]);


  const handleStartGame = () => {
    setStep(0);
    socket.emit("gameStart", { questions, gameMode: "kahoot" });
  };

  const handleNextQuestion = () => {
    console.log("🧼 handleNextQuestion triggered");
    setTimeout(() => {
    socket.emit("calculateKahootScores");
    setResultsVisible(false);
    setFinalVotes({}); // ✅ Clear after chart is done

    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setStep(nextIndex);
    } else {
      setStep("done");
    }
  }, 3000); // ⏱ Give 3s for chart display
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
    {step === -1 && (
      <div className="romantic-banner">
        <img src="/sarah-danish.png" alt="Sarah and Danish" className="banner-image" />
        <h1 className="romantic-title">💖 Sarah & Danish Knowledge Competition 💖</h1>
      </div>
    )}
  
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
      {/* ✅ Left box only shows during game */}
      {typeof step === "number" && step >= 0 && step !== "done" && (
        <div className="admin-section">
          {step === -1 && (
            <>
              <h2>Players Joined:</h2>
              {players.map((player, index) => (
                <p key={index} className="fade-in-player">{player.name}</p>
              ))}
            </>
          )}
  
          {currentQuestion && (
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
      )}
  
      {/* ✅ Right side always shows results, leaderboard, etc. */}
      <div className="admin-section">
        {resultsVisible && step !== "done" && (
          <>
            <h2>Live Answer Breakdown</h2>
            <VoteChart
              key={`${step}-${currentQuestionIndex}-${JSON.stringify(finalVotes)}`}
              votes={finalVotes}
              question={questions[currentQuestionIndex]}
            />
          </>
        )}
  
        {step === "done" && (
          <div className="thank-you-banner">
            <img src="/thank-you.png" alt="Thank You" className="thank-you-image" />
            <h2 className="thank-you-message">Thank you for playing! 💘</h2>
          </div>
        )}
  
        {(typeof step === "number" && step >= 1) || step === "done" ? (
          <>
            <h2>Leaderboard:</h2>
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => {
                const isLast = index === leaderboard.length - 1;
                const emoji =
                  index === 0 ? "👑" :
                  index === 1 ? "🥈" :
                  index === 2 ? "🥉" :
                  isLast ? "💩" : "😞";
  
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
