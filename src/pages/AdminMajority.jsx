import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";

export default function AdminMajority() {
  const { socket, resetGame, setStep, players, leaderboard, step } = useGame();

  const questions = [
    {
      question: "What’s actually the sexiest trait in your partner?",
      options: [
        "Confidence",
        "Humor",
        "Intelligence",
        "Looks"
      ]
    },
    {
      question: "What’s the hottest kind of kiss?",
      options: [
        "Slow and teasing",
        "Up against the wall",
        "Morning bedhead kiss",
        "We don't kiss"
      ]
    },
    {
      question: "What’s a guaranteed way to ruin the mood?",
      options: [
        "Bringing up chores",
        "Talk about the kids",
        "Cold feet",
        "Talk about parents or siblings"
      ]
    },
    {
      question: "In bed — what’s most important?",
      options: [
        "Communication",
        "Creativity",
        "Endurance",
        "Size"
      ]
    },
    {
      question: "What’s the biggest lie people tell about their sex life?",
      options: [
        "“We do it all the time.”",
        "“We never fight about it.”",
        "“Size doesn’t matter.”",
        "“We’ve never faked it.”"
      ]
    },
    {
      question: "What’s the ultimate couple's code word for “let’s get some”?",
      options: [
        "“Let’s take a nap”",
        "“I need help in the kitchen”",
        "“Can we talk in private?”",
        "I need to freshen up"
      ]
    },
    {
      question: "Who is most likely to initiate something risky in public?",
      options: [
        "Danish, with that mischievous smirk",
        "Sarah, queen of bold moves",
        "Depends who had more wine",
        "Both — they’re trouble together"
      ]
    },
    {
      question: "Sarah gives Danish the 'I'm ready wink'. Danish’s first thought?",
      options: [
        "Cancel all my meetings",
        "I’m being seduced and I love it",
        "Play it cool and pretend to be sleepy",
        "God bless this woman"
      ]
    },
    {
      question: "What’s Danish’s secret move that gets Sarah every time?",
      options: [
        "That deep voice whisper",
        "Neck kisses",
        "The way he takes charge",
        "Beard + cologne combo — lethal"
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
