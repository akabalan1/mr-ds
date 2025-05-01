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

  const questions = [
  {
    question: "What is Noura's favorite food",
    options: [
      "Philly cheese steak",
      "Chicken tikka masala",
      "Deserts",
      "Tacos"
    ],
    correctAnswer: "Philly cheese steak"
  },
  {
    question: "What is Noura's job title at her actual job?",
    options: [
      "Sr. Business Analyst",
      "Finance Manager",
      "Principal Data Analyst",
      "Operations Finance Analyst"
    ],
    correctAnswer: "Principal Data Analyst"
  },
  {
    question: "What is Noura's actual birthday?",
    options: [
      "5/2",
      "5/3",
      "5/4",
      "The day she met Al"
    ],
    correctAnswer: "5/3"
  },
  {
    question: "What is Noura's favorite drink?",
    options: [
      "Dirty Martini",
      "White Wine",
      "Margaritas",
      "Bloody Mary"
    ],
    correctAnswer: "Bloody Mary"
  },
  {
    question: "At what age did Noura have Omar?",
    options: [
      "26",
      "28",
      "25",
      "27"
    ],
    correctAnswer: "26"
  },
  {
    question: "What is Noura's coffee order?",
    options: [
      "Vanilla Latte",
      "Iced oat milk latte with 2 pumps vanilla",
      "Cold brew with sweet cream",
      "She doesn't drink coffee"
    ],
    correctAnswer: "Vanilla Latte"
  },
  {
    question: "Who is Noura's super hero crush?",
    options: [
      "Captain America",
      "Al Kabalan",
      "Batman",
      "Thor"
    ],
    correctAnswer: "Thor"
  },
  {
    question: "What was Noura's first job?",
    options: [
      "Cashier at Office Max",
      "Hooters girl",
      "Clerk at Home Depot",
      "DSW Shoe Sales"
    ],
    correctAnswer: "Cashier at Office Max"
  },
  {
    question: "What was Noura's nickname in college?",
    options: [
      "Bootylicious",
      "Badonkadonk Babe",
      "No limit Noura",
      "Trouble"
    ],
    correctAnswer: "No limit Noura"
  },
  {
    question: "What's Noura's guilty pleasure?",
    options: ["Bravo", "Chocolate"],
    correctAnswer: "Bravo",
    rapidFire: true
  },
  {
    question: "Which city would Noura pick",
    options: ["Waikiki", "Miami"],
    correctAnswer: "Waikiki",
    rapidFire: true
  },
  {
    question: "Which shoes would Noura pick",
    options: ["Louboutin", "Channel"],
    correctAnswer: "Louboutin",
    rapidFire: true
  },
  {
    question: "Mountain or Beach",
    options: ["Mountain", "Beach"],
    correctAnswer: "Beach",
    rapidFire: true
  },
  {
    question: "Summer or Winter?",
    options: ["Summer", "Winter"],
    correctAnswer: "Summer",
    rapidFire: true
  },
  {
    question: "Noura loves hot tubs",
    options: ["True", "False"],
    correctAnswer: "False",
    rapidFire: true
  },
  {
    question: "If you're looking at the bed, which side does Noura sleep on?",
    options: ["Left", "Right"],
    correctAnswer: "Left",
    rapidFire: true
  },
  {
    question: "Where did Noura get her MBA?",
    options: ["University of Tennessee", "University of Massachusetts"],
    correctAnswer: "University of Massachusetts",
    rapidFire: true
  },
  {
    question: "WWat did Noura major in?",
    options: ["Data Science", "International Finance"],
    correctAnswer: "International Finance",
    rapidFire: true
  },
  {
    question: "What is Noura's biggest pet peeve",
    options: ["People who are late", "Slurping your drink"],
    correctAnswer: "People who are late",
    rapidFire: true
  },
  {
    question: "Is she a morning person or evening person?",
    options: ["Evening person", "Neither"],
    correctAnswer: "Neither",
    rapidFire: true
  },
  {
    question: "How to get into Noura's heart?",
    options: ["Food", "Do chores"],
    correctAnswer: "Food",
    rapidFire: true
  },
  {
    question: "Where does Noura invest her money?",
    options: ["Municipal Bonds", "Designer Purses"],
    correctAnswer: "Designer Purses",
    rapidFire: true
  },
  {
    question: "Does Noura prefer doing the dishes or mopping the floor?",
    options: ["Doing the dishes", "Mopping the floor"],
    correctAnswer: "Mopping the floor",
    rapidFire: true
  }
];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalVotes, setFinalVotes] = useState({});
  const [timer, setTimer] = useState(20);
  const [resultsVisible, setResultsVisible] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (typeof step === "number" && step >= 0 && step !== "done") {
      setTimer(currentQuestion?.rapidFire ? 10 : 20);
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
    if (timer > 0 || !resultsVisible) {
      console.warn("⛔ Next question triggered too early. Ignored.");
      return;
    }
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
        <img src="/sdkahootw.png" alt="Noura" className="banner-image" />
        <h1 className="romantic-title">💖 Noura's Knowledge Challenge 💖</h1>
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
      {/* ✅ Players before game starts */}
      {step === -1 && (
        <div className="admin-section">
          <h2>Players Joined:</h2>
          {players.map((player, index) => (
            <p key={index} className="fade-in-player">{player.name}</p>
          ))}
        </div>
      )}
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
              <p style={{ color: "white", marginBottom: "1rem" }}>⏳ Time remaining: {timer}s</p>
  
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
            <img src="/sdkahootb.png" alt="Thank You" className="thank-you-image" />
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
