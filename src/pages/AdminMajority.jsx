// src/pages/AdminMajority.jsx
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminMajority() {
  const { setStep, socket, setPlayers, players, resetGame } = useGame();
  const [questions] = useState([
    { question: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { question: "What is the best type of music?", options: ["Rock", "Pop", "Classical", "Jazz"] },
    { question: "What is your favorite fruit?", options: ["Apple", "Banana", "Orange", "Grapes"] },
  ]);
  const [currentVotes, setCurrentVotes] = useState({});
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("updateVotes", (newVotes) => {
        setCurrentVotes(newVotes);
        calculateScores(newVotes);
      });
      return () => {
        socket.off("updateVotes");
      };
    }
  }, [socket]);

  const handleStartGame = () => {
    setStep(1); // Start the game (move to the first question)
    setGameStarted(true);
    socket.emit("gameStart", questions);
  };

  const calculateScores = (votes) => {
    const optionCounts = {};
    for (let player in votes) {
      const vote = votes[player];
      optionCounts[vote] = (optionCounts[vote] || 0) + 1;
    }
    const sortedOptions = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
    const majorityVote = sortedOptions[0][0];
    const leastCommonVote = sortedOptions[sortedOptions.length - 1][0];

    let updatedPlayers = [...players];
    updatedPlayers.forEach((player) => {
      const playerVote = votes[player.name];
      if (playerVote === majorityVote) {
        player.points += 3; // Majority gets 3 points
      } else if (playerVote === leastCommonVote) {
        player.points += 1; // Least common gets 1 point
      }
    });
    setPlayers(updatedPlayers);
  };

  const handleResetGame = () => {
    resetGame();          // Emit reset event to the server and reset game state
    setStep(-1);          // Reset the step to the initial state
    localStorage.removeItem("playerName"); // Clear stored player name
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <button
        onClick={handleStartGame}
        className="game-mode-btn bg-blue-600 text-white p-3 rounded"
        disabled={gameStarted}
      >
        {gameStarted ? "Game Started" : "Start Majority Rules"}
      </button>
      <button
        onClick={handleResetGame}
        className="game-mode-btn bg-red-600 text-white p-3 rounded mt-4"
      >
        Reset Game
      </button>
      
      <div className="mt-6">
        <h2 className="font-bold">Current Votes:</h2>
        {Object.entries(currentVotes).map(([player, vote]) => (
          <p key={player}>{player} voted for: {vote}</p>
        ))}
      </div>
      
      <div className="mt-6">
        <h2 className="font-bold">Players Joined:</h2>
        {players.map((player, index) => (
          <p key={index}>{player.name}</p>
        ))}
      </div>
    </Layout>
  );
}
