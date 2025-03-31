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
    votes
  } = useGame();

  const [timer, setTimer] = useState(15);
  const [active, setActive] = useState(false);
  const [showChart, setShowChart] = useState(false);

 const playSound = (url) => {
  const audio = new Audio(url);
  audio.play().catch((err) => {
    console.warn("Audio play failed:", err);
  });
};

  useEffect(() => {
    let countdown;
    if (active && timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (active && timer === 0) {
      calculateTally();
      playSound(resultSound);
      setShowChart(true);
      setActive(false);
    }
    return () => clearTimeout(countdown);
  }, [timer, active]);

  useEffect(() => {
    socket.on("gameState", (state) => {
      console.log("Received game state:", state);
    });
    socket.on("voteUpdate", (voteData) => {
      console.log("Vote update:", voteData);
    });
    socket.on("nextQuestion", (index) => {
      console.log("Next question index:", index);
      setTimer(15);
      setActive(true);
      setShowChart(false);
      playSound(startSound);
    });
  }, []);

  if (step === -1) {
    return (
      <div className="container">
        <h1>Admin Panel</h1>
        <img src="/assets/images/intro.jpg" alt="Welcome" style={{ maxWidth: '100%', borderRadius: '16px' }} />
        <button onClick={() => {
          setStep(0);
          socket.emit("nextQuestion");
          setActive(true);
          playSound(startSound);
        }}>Start Game</button>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="container">
        <h2>Game Over!</h2>
        <img src="/assets/images/closing.jpg" alt="Thanks" style={{ maxWidth: '100%', borderRadius: '16px', marginBottom: '20px' }} />
        <h3>Leaderboard:</h3>
        <ul>
          {players
            .sort((a, b) => b.score - a.score)
            .map((p, i) => (
              <li key={i}>{p.name}: {p.score} pts</li>
            ))}
        </ul>
        <img src="https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif" alt="celebration" style={{ marginTop: '20px', maxWidth: '80%' }} />
      </div>
    );
  }

  const q = questions[questionIndex];
  return (
    <div className="container">
      <h2>Q: {q.text}</h2>
      <div>
        <img src="/assets/images/sarah.png" alt="Sarah" style={{ height: '80px', margin: '10px' }} />
        <img src="/assets/images/danish.png" alt="Danish" style={{ height: '80px', margin: '10px' }} />
      </div>
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
    </div>
  );
}
