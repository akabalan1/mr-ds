import React, { useEffect, useState } from "react";
import { useGame } from "../GameContext";

export default function PlayerKahoot() {
  const {
    step,
    questionIndex,
    questions,
    submitKahootAnswer,
    addPlayer
  } = useGame();

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [selected, setSelected] = useState(null);
  const [timerStart, setTimerStart] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setName(stored);
      addPlayer(stored);
      setJoined(true);
    }
  }, []);

  useEffect(() => {
    if (typeof step === "number") {
      setSelected(null);
      setTimerStart(Date.now());
    }
  }, [step]);

  const handleJoin = () => {
    if (name.trim()) {
      localStorage.setItem("playerName", name);
      addPlayer(name);
      setJoined(true);
    }
  };

  const handleAnswer = (opt) => {
    if (!selected) {
      const timeTaken = Math.floor((Date.now() - timerStart) / 1000);
      setSelected(opt);
      submitKahootAnswer(name, opt, timeTaken);
    }
  };

  const currentQ = questions[questionIndex];

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-3xl mb-4">Enter your name to join</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border px-4 py-2 rounded-xl mb-4"
        />
        <button
          onClick={handleJoin}
          className="bg-purple-500 text-white px-6 py-2 rounded-xl"
        >
          Join Game
        </button>
      </div>
    );
  }

  if (!currentQ || step === -1) {
    return <div className="text-center mt-12">Waiting for host to start...</div>;
  }

  if (step === "done") {
    return <div className="text-center mt-12 text-2xl">🎉 Game Complete!</div>;
  }

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl mb-6">Q{questionIndex + 1}: {currentQ.text}</h2>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className={`px-6 py-3 rounded-xl border shadow ${selected === opt ? "bg-purple-600 text-white" : "bg-white"}`}
            disabled={!!selected}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && <p className="mt-4 text-green-600">Answer locked in!</p>}
    </div>
  );
}