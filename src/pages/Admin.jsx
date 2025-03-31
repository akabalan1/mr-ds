
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

export default function Admin() {
  const [step, setStep] = useState(-1);
  const [tally, setTally] = useState({});
  const [votes, setVotes] = useState({});

  const startGame = () => setStep(0);

  const calculateTally = (qIndex) => {
    const currentVotes = votes[qIndex] || [];
    const counts = {};
    currentVotes.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
    setTally(counts);
  };

  const nextQuestion = () => {
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setStep("done");
    }
  };

  if (step === -1) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Admin Panel</h1>
        <button onClick={startGame}>Start Game</button>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Game Over!</h2>
        <pre>{JSON.stringify(tally, null, 2)}</pre>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ padding: 20 }}>
      <h2>Q: {q.text}</h2>
      <button onClick={() => calculateTally(step)}>Show Results</button>
      <button onClick={nextQuestion} style={{ marginLeft: 10 }}>Next</button>
      <div style={{ marginTop: 20 }}>
        <pre>{JSON.stringify(tally, null, 2)}</pre>
      </div>
    </div>
  );
}
