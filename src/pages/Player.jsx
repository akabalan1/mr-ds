
import React, { useState } from "react";

const questions = [
  {
    text: "What’s the best date night activity?",
    options: ["Dinner", "Netflix & Chill", "Game Night", "Long Walk"]
  },
  {
    text: "Who usually says 'I love you' first?",
    options: ["Her", "Him", "Neither", "At the same time"]
  }
];

export default function Player() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [step, setStep] = useState(0);

  const handleJoin = () => {
    if (name.trim()) {
      setJoined(true);
    }
  };

  const vote = (option) => {
    console.log(`${name} voted: ${option}`);
    // Simulate advancing after vote
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setStep("done");
    }
  };

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

  if (step === "done") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Thanks for playing, {name}!</h2>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ padding: 20 }}>
      <h2>{q.text}</h2>
      {q.options.map((opt, i) => (
        <button key={i} onClick={() => vote(opt)} style={{ display: "block", margin: "10px 0" }}>
          {opt}
        </button>
      ))}
    </div>
  );
}
