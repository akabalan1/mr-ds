
import React, { useEffect, useState } from "react";
import { useGame } from "../GameContext";
import socket from "../socket";
import VoteChart from "../components/VoteChart";

const startSound = "/assets/sounds/start.mp3";
const resultSound = "/assets/sounds/result.mp3";

export default function Admin() {
  const {
    step,
    setStep,
    questionIndex,
    questions,
    tally,
    calculateTally,
    nextQuestion,
    players,
    resetGame
  } = useGame();

  const [timer, setTimer] = useState(15);
  const [active, setActive] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play().catch((err) => console.warn("Audio failed:", err));
  };

  useEffect(() => {
    socket.on("voteUpdate", (voteData) => {
      setShowChart(false);
    });

    socket.on("nextQuestion", (index) => {
      setQuestionIndex(index);
      setStep(index);
      setTimer(15);
      setActive(true);
      setShowChart(false);
      playSound(startSound);
    });
  }, []);

  const handleReset = () => {
    resetGame();
    socket.emit("resetGame");
  };

  const handleStart = () => {
    resetGame();
    socket.emit("resetGame");
    setStep(0);
    socket.emit("nextQuestion");
    setActive(true);
    playSound(startSound);
  };

  const q = questions[questionIndex];

  return (
    <div className="container">
      <h1>Admin Panel</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>Signed-up Players:</h3>
        {players && players.length > 0 ? (
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p>Waiting for players to join...</p>
        )}
      </div>

      {(step === -1 || step === "done" || !questions[questionIndex]) && (
        <>
          <button onClick={handleStart} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px' }}>Start Game</button>
          <button onClick={handleReset} style={{ marginLeft: 10, backgroundColor: '#f44336', color: 'white', padding: '10px 20px' }}>Reset Game</button>
          {step === "done" && (
            <>
              <h3 style={{ marginTop: 20 }}>Leaderboard:</h3>
              <ul>
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((p, i) => (
                    <li key={i}>{p.name}: {p.score} pts</li>
                  ))}
              </ul>
            </>
          )}
        </>
      )}

      {step !== -1 && step !== "done" && questions[questionIndex] && (
        <>
          <h2>Q: {q.text}</h2>
          <div style={{ fontSize: 24, fontWeight: 'bold', margin: '10px 0' }}>⏳ Time Left: {timer}s</div>
          <button onClick={() => {
            calculateTally();
            playSound(resultSound);
            setShowChart(true);
            setActive(false);
          }}>Show Results</button>
          <button onClick={() => {
            nextQuestion();
            socket.emit("nextQuestion");
            setTimer(15);
            setActive(true);
            setShowChart(false);
            playSound(startSound);
          }} style={{ marginLeft: 10 }}>Next</button>
          <div style={{ marginTop: 20 }}>
            {showChart && <VoteChart tally={tally} />}
          </div>
        </>
      )}
    </div>
  );
}
