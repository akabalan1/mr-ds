
import React, { useEffect, useState } from "react";
import { useGame } from "../GameContext";
import socket from "../socket";

export default function Player() {
  const {
    players,
    addPlayer,
    step,
    questions,
    questionIndex,
    submitVote,
    setStep
  } = useGame();

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleJoin = () => {
    if (name.trim()) {
      addPlayer(name.trim());
      socket.emit("join", name.trim());
      setJoined(true);
    }
  };

  useEffect(() => {
    socket.on("nextQuestion", (index) => {
      setVoted(false);
      setStep(index);
    });
    socket.on("voteUpdate", (votes) => {
      console.log("Player received vote update:", votes);
    });
  }, [setStep]);

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Join the Game</h1>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleJoin} style={{ marginLeft: 10 }}>Join</button>
      </div>
    );
  }

  if (step === -1) {
    return <div style={{ padding: 20 }}><h2>Waiting for admin to start the game...</h2></div>;
  }

  if (step === "done") {
    const player = players.find(p => p.name === name);
    return (
      <div style={{ padding: 20 }}>
        <h2>Thanks for playing, {name}!</h2>
        <p>Your final score: {player?.score || 0}</p>
      </div>
    );
  }

  const q = questions[questionIndex];
  return (
    <div style={{ padding: 20 }}>
      <h2>{q.text}</h2>
      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => {
            if (!voted) {
              console.log("Submitting vote:", { name, option: opt, questionIndex });
              submitVote(name, opt);
              socket.emit("vote", { name, option: opt });
              setVoted(true);
            }
          }}
          style={{
            display: "block",
            margin: "10px 0",
            backgroundColor: voted ? "#ccc" : "#f06292"
          }}
          disabled={voted}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
