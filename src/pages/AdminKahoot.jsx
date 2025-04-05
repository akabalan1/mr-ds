import React from "react";
import { useGame } from "../GameContext";

export default function AdminKahoot() {
  const {
    step,
    setStep,
    questionIndex,
    questions,
    nextQuestion,
    resetGame,
    players,
    leaderboard
  } = useGame();

  const currentQ = questions[step];

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🎯 Kahoot Admin</h1>
      <p className="mb-4">Players joined: {players.length}</p>

      {step === -1 && (
        <button
          onClick={() => setStep(0)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Start Game
        </button>
      )}

      {typeof step === "number" && step >= 0 && step < questions.length && (
        <div>
          <h2 className="text-xl mb-2">Q{step + 1}: {currentQ.text}</h2>
          <ul className="mb-4">
            {currentQ.options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
          <div className="space-x-3">
            <button
              onClick={nextQuestion}
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
            >
              Next Question
            </button>
            <button
              onClick={resetGame}
              className="bg-red-500 text-white px-5 py-2 rounded-lg"
            >
              Reset Game
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">🏆 Final Leaderboard</h2>
          <ul className="text-left max-w-md mx-auto">
            {leaderboard.map((entry, idx) => (
              <li key={idx}>
                {idx + 1}. {entry.name} - {entry.score} pts
              </li>
            ))}
          </ul>
          <button
            onClick={resetGame}
            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}