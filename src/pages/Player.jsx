
import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";

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

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      setName(savedName);
      addPlayer(savedName); // re-join silently
    }
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

  return (
    <div className="container">
      {!name ? (
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
