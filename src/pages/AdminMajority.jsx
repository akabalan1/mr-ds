import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";

export default function AdminMajority() {
  const { socket, resetGame, setStep, players, leaderboard, step } = useGame();

  const questions = [
    {
      question: "What’s Noura most likely to say when something goes wrong?",
      options: [
        "It is what it is.",
        "Noooo way!",
        "We’ll figure it out.",
        "A silent death stare"
      ]
    },
    {
      question: "What’s Noura’s hidden talent?",
      options: [
        "Singing",
        "Doing celebrity impressions",
        "Parallel parking like a pro",
        "Remembering everyone’s birthday"
      ]
    },
    {
      question: "What’s Noura’s biggest fear?",
      options: [
        "Spiders",
        "Bare feet",
        "Packing last minute and being late to the airport",
        "Heights"
      ]
    },
    {
      question: "If Noura were a drink, what would she be?",
      options: [
        "A triple-shot espresso with attitude",
        "A glass of chilled rosé on a yacht",
        "A green juice that costs $18",
        "Tap water... but only in a reusable bottle"
      ]
    },
    {
      question: "How would Noura survive a zombie apocalypse?",
      options: [
        "Charm the zombies into sparing her",
        "Join them and become their queen",
        "Bribe them with skincare products",
        "She wouldn’t—too busy taking a selfie"
      ]
    },
    {
      question: "Which song would play when Noura walks into a room?",
      options: [
        "“Boss B*tch” – Doja Cat",
        "“Savage” – Megan Thee Stallion",
        "“Unwritten” – Natasha Bedingfield",
        "Dramatic orchestral entrance music"
      ]
    },
    {
      question: "What’s most likely to make Noura ghost you?",
      options: [
        "You forgot her birthday",
        "You called brunch “overrated”",
        "You said astrology is fake",
        "You said reality TV is dumb"
      ]
    },
    {
      question: "If Noura were to start drama at a wedding, how would she do it?",
      options: [
        "Subtle eye rolls and whispered commentary",
        "“Accidentally” wearing white",
        "Roasting the groom in her speech",
        "Bitch slapping the bride"
      ]
    },
    {
      question: "What’s Noura’s ultimate power move in an argument?",
      options: [
        "The silent treatment",
        "Sarcastic one-liner",
        "Dramatic walkaway",
        "Passive-aggressive meme drop"
      ]
    }
  ];


  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentVotes, setCurrentVotes] = useState({});
  const [finalVotes, setFinalVotes] = useState({});
  const [voteCount, setVoteCount] = useState(0);
  const [timer, setTimer] = useState(20);
  const [resultsVisible, setResultsVisible] = useState(false);

  // 🔄 Sync live votes
  useEffect(() => {
    if (socket) {
     socket.on("updateVotes", (newVotes) => {
       setCurrentVotes(newVotes); // just use the latest full set of votes for this question
      });  
      return () => {
        socket.off("updateVotes");
      };
    }
  }, [socket]);

  // ⏱️ Start timer for each question
  useEffect(() => {
    if (typeof step !== "number" || step === "done") return;
    setTimer(20);
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
  }, [step]);

  // ⏳ Show results when timer ends
  useEffect(() => {
    if (timer === 0 && typeof step === "number" && step >= 0 && step !== "done") {
      setFinalVotes({ ...currentVotes });
      setResultsVisible(true);
    }
  }, [timer, currentVotes, step]);

  const handleStartGame = () => {
    setStep(0);
    setResultsVisible(false);
    socket.emit("gameStart", { questions, gameMode: "majority" });
  };

  const handleNextQuestion = () => {
    if (timer > 0 || !resultsVisible) {
      console.warn("⛔ Next question triggered too early. Ignored.");
      return;
    }
  // Delay score calculation to allow vote chart to display
  setTimeout(() => {
    socket.emit("calculateMajorityScores");
    setResultsVisible(false);
    setCurrentVotes({}); // ✅ Clear votes for the next question

    if (currentQuestion < questions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setStep(nextQuestionIndex);
    } else {
      setStep("done");
    }
  }, 3000); // Wait 3 seconds before progressing to next question
};


  const handleResetGame = () => {
    resetGame();
    setStep(-1);
    setCurrentQuestion(0);
    setFinalVotes({});
    setResultsVisible(false);
    localStorage.removeItem("playerName");
  };
// Helper to check if a player has voted
const hasVoted = (playerName) => {
  return currentVotes && currentVotes[playerName];
};

  return (
    <Layout>
      {step === -1 && (
        <div className="romantic-banner">
          <img src="/sdmajorityw.png" alt="Welcome to Majority" className="banner-image" />
          <h1 className="romantic-title">💖 Welcome to Majority Rules 💖</h1>
        </div>
      )}
    
      <div className="admin-controls">
        {step === -1 && (
          <button onClick={handleStartGame} className="game-mode-btn bg-green-600">
            Start Majority Rules
          </button>
        )}
    
        {typeof step === "number" && step >= 0 && step !== "done" && (
          <button
            onClick={handleNextQuestion}
            disabled={timer > 0 || !resultsVisible}
            className="game-mode-btn bg-blue-600"
          >
            {currentQuestion === questions.length - 1 ? "Finish Game" : "Next Question"}
          </button>
        )}
    
        <button onClick={handleResetGame} className="game-mode-btn bg-red-600">
          Reset Game
        </button>
      </div>
    
      <div className="admin-panel">
        {/* ⬅️ Left Column */}
        {step !== "done" && (
          <div className="admin-section">
            {typeof step === "number" && step >= 0 && (
              <>
                <h2>Current Question:</h2>
                <p>
                  <strong>Q{currentQuestion + 1}:</strong>{" "}
                  {questions[currentQuestion].question}
                </p>
                <p style={{ color: "white" }}>⏳ Time remaining: {timer}s</p>
                <ul>
                  {questions[currentQuestion].options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </>
            )}
    
            {players.length > 0 && (
              <>
                <h2 style={{ marginTop: "1.5rem" }}>
                  {step >= 0 ? "Vote Tally:" : "Players Joined:"}
                </h2>
                {players.map((player, index) => (
                  <p
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {player.name}
                    {step >= 0 ? (
                      currentVotes[player.name] ? (
                        <span style={{ color: "green" }}>✅</span>
                      ) : (
                        <span style={{ color: "gray" }}>⌛</span>
                      )
                    ) : null}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
    
        {/* ➡️ Right Column */}
        <div className="admin-section">
          {resultsVisible && step !== "done" && (
            <>
              <h2>Live Vote Distribution</h2>
              <VoteChart
                votes={finalVotes}
                question={questions[currentQuestion]}
              />
            </>
          )}
    
          {step === "done" && (
            <div className="thank-you-banner">
              <img src="/sdmajorityb.png" alt="Thank You" className="thank-you-image" />
              <h2 className="thank-you-message">Thanks for playing Majority Rules! 💘</h2>
            </div>
          )}
    
          {((typeof step === "number" && step >= 1) || step === "done") && (
            <>
              <h2>Leaderboard:</h2>
              {leaderboard.length > 0 ? (
                leaderboard.map((player, index) => {
                  const isTop3 = index < 3;
                  const isBottom3 = index >= leaderboard.length - 1;
                  let emoji = "";
    
                  if (step === "done") {
                    if (isTop3) emoji = ["👑", "🥈", "🥉"][index] || "🎉";
                    else if (isBottom3) emoji = "💩";
                  }
    
                  return (
                    <p key={index}>
                      {index + 1}. {player.name}: {player.score} points{" "}
                      {emoji && <span>{emoji}</span>}
                    </p>
                  );
                })
              ) : (
                <p>No players to show.</p>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>

  );
}
