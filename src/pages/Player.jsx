
import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";
import socket from "../socket";

export default function Player() {
  const {
    addPlayer,
    questions,
    questionIndex,
    submitVote,
    step,
    setStep,
    tally,
    players
  } = useGame();

  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");

  // Refresh-safe rejoin
  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setName(savedName);
      setTimeout(() => {
        addPlayer(savedName);
      }, 100);
    }
  }, []);

  // Listen for full reset
  useEffect(() => {
    socket.on("gameState", (state) => {
      if (
        state.players.length === 0 &&
        Object.keys(state.votes).length === 0 &&
        state.questionIndex === 0
      ) {
        console.log("↩ Game was reset — clearing all local state");
        setSelected("");
        localStorage.removeItem("playerName");
        setName("");
      }
    });
  }, []);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name);
      addPlayer(name);
    }
  };

  const handleVote = (option) => {
    if (name) {
      setSelected(option);
      submitVote(name, option);
    }
  };

  const q = questions[questionIndex];
  const isJoined = players.some((p) => p.name === name);

  return (
    <div className="container">
      {!isJoined || !name ? (
        <>
          <h2>Enter Your Name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          <button onClick={handleJoin}>Join Game</button>
        </>
      ) : (
        <>
          <h2>Hello {name}!</h2>

          {step === "done" ? (
            <>
              <h3>Game Over!</h3>
              <ul>
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((p, i) => (
                    <li key={i}>{p.name}: {p.score} pts</li>
                  ))}
              </ul>
            </>
          ) : q ? (
            <>
              <h3>{q.text}</h3>
              <div className="options">
                {q.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVote(opt)}
                    disabled={!!selected}
                    className={selected === opt ? "selected" : ""}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {selected && <p>Waiting for results...</p>}
            </>
          ) : (
            <p>Waiting for host to start...</p>
          )}
        </>
      )}
    </div>
  );
}
