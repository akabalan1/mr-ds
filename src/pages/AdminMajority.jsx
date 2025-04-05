import React from "react";
import { useGame } from "../GameContext";
import VoteChart from "../components/VoteChart";

export default function AdminMajority() {
  const {
    step,
    setStep,
    questionIndex,
    questions,
    nextQuestion,
    resetGame,
    showResults,
    votes,
    players,
    tally
  } = useGame();

  const currentVotes = votes[questionIndex] || [];

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🧑‍⚖️ Admin: Majority Rules</h1>
      <p className="mb-4">Players joined: {players.length}</p>

      {step === -1 && (
        <button
          onClick={() => setStep(questionIndex)}
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          Start Game
        </button>
      )}

      {typeof step === "number" && step >= 0 && step < questions.length && (
        <>
          <h2 className="text-xl font-semibold mb-4">Q{step + 1}: {questions[step].text}</h2>
          <div className="flex justify-center gap-4 mb-4">
            {questions[step].options.map((opt, idx) => (
              <div
                key={idx}
                className="border rounded-xl px-4 py-2 bg-white text-black shadow-md"
              >
                {opt}
              </div>
            ))}
          </div>
          <div className="space-x-4">
            <button
              onClick={showResults}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Show Results
            </button>
            <button
              onClick={nextQuestion}
              className="bg-yellow-600 text-white px-5 py-2 rounded-lg"
            >
              Next Question
            </button>
            <button
              onClick={resetGame}
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Reset Game
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">🎉 Game Over!</h2>
          <VoteChart tally={tally} />
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