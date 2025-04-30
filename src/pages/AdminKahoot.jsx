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
    question: "What horrifying breakfast twist did Sarah witness at IHOP, the first time she went there with Danish?",
    options: [
      "He said “this place could use more masala”",
      "Danish ordered a burger at 8am",
      "He put black pepper in orange juice",
      "He ate pancakes with his hands"
    ],
    correctAnswer: "He put black pepper in orange juice"
  },
  {
    question: "What role does Danish play in Sarah’s life?",
    options: [
      "Her content editor",
      "Her hacker boyfriend",
      "Her emotional support pillow",
      "Her IT helpdesk"
    ],
    correctAnswer: "Her IT helpdesk"
  },
  {
    question: "What does Danish get Sarah every Valentine’s Day?",
    options: [
      "Lavender flowers",
      "Chicken Tikka Masala",
      "Nothing he is the best gift",
      "Pregnancy test"
    ],
    correctAnswer: "Lavender flowers"
  },
  {
    question: "Who taught who how to cook many of their signature meals?",
    options: [
      "ChatGPT",
      "Danish taught Sarah",
      "Sarah taught Danish",
      "They just seduce each other with takeout"
    ],
    correctAnswer: "Danish taught Sarah"
  },
  {
    question: "What did Danish ask Sarah just hours after she gave birth?",
    options: [
      "Do you want more kids?",
      "Do you want IHOP?",
      "The baby has your forehead. I’m so sorry.",
      "Can I tell my cricket friends I’m free to play tonight?"
    ],
    correctAnswer: "Can I tell my cricket friends I’m free to play tonight?"
  },
  {
    question: "Why did Sarah ban appetizers at restaurants?",
    options: [
      "Danish keeps over-ordering",
      "She's morally against mozzarella sticks",
      "She wants to save room for dessert",
      "To save money"
    ],
    correctAnswer: "Danish keeps over-ordering"
  },
  {
    question: "What savage comment did Danish make to Sarah on their wedding day?",
    options: [
      "We did it! I can’t believe we’re married!",
      "Did you bring snacks?",
      "You kind of look like a ghost with that makeup",
      "You look like a Bollywood queen!"
    ],
    correctAnswer: "You kind of look like a ghost with that makeup"
  },
  {
    question: "Which K-drama has Sarah made Danish watch so many times he can quote it?",
    options: [
      "Goblin",
      "Crash Landing on You",
      "50 Shades of Seoul",
      "Squid Game"
    ],
    correctAnswer: "Crash Landing on You"
  },
  {
    question: "What was Danish’s very first flirt move when meeting Sarah?",
    options: [
      "I’ve read every book but you",
      "Wanna see my cricket stats?",
      "I lost my number… can I have yours?",
      "You’re a Rizvi, I’m a Rizvi!"
    ],
    correctAnswer: "You’re a Rizvi, I’m a Rizvi!"
  },
  {
    question: "Who said it: \"I cannot get the image of John twerking out of my head.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Yeah we were doing non billionaire activities 🙂\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"No sex, intoxication in heaven\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"It also won't mysteriously overheat randomly a few weeks later.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"not everything is sex related 🙄\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Matt can teach that course\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Virgins that will stay virgins.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"The Shiaa actually have already been granted heaven.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"If that happens to you I'm going to Mexico City and starting a new life.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"It’s not cheating if you’re in the same zip code.\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
    rapidFire: true
  },
  {
    question: "Who said it: \"Take your time… my knees are just killing me. lol :) 😂\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Let’s do all of the above… brunch, lunch and dinner so it’s inclusive for everyone :)\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Hopefully it is sweeter than you :)\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Sarah",
    rapidFire: true
  },
  {
    question: "Who said it: \"Will you convert to Shia to preside over our vows renewal 😁\"",
    options: ["Sarah", "Danish"],
    correctAnswer: "Danish",
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
        <img src="/sdkahootw.png" alt="Sarah and Danish" className="banner-image" />
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
