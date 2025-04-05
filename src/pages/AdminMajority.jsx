import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function AdminMajority() {
  const { setStep, socket, setPlayers, players } = useGame();
  const [questions] = useState([
    { question: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { question: "What is the best type of music?", options: ["Rock", "Pop", "Classical", "Jazz"] },
    { question: "What is your favorite fruit?", options: ["Apple", "Banana", "Orange", "Grapes"] },
  ]);
  const [currentVotes, setCurrentVotes] = useState({});
  const [gameStarted, setGameStarted] = useState(false); // Track game start status
  
  useEffect(() => {
    socket.on("updateVotes", (newVotes) => {
      setCurrentVotes(newVotes);
      calculateScores(newVotes); // Recalculate scores whenever votes change
    });

    return () => {
      socket.off("updateVotes");
    };
  }, [socket]);

  const handleStartGame = () => {
    setStep(1);
    setGameStarted(true); // Mark the game as started
    socket.emit("gameStart", questions); // Send the questions to all players
  };

  // Calculate scores for players based on majority rules
  const calculateScores = (votes) => {
    const optionCounts = {}; // Track how many players chose each option
    for (let player in votes) {
      const vote = votes[player];
      optionCounts[vote] = (optionCounts[vote] || 0) + 1;
    }

    // Determine the majority and minority votes
    const sortedOptions = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
    const majorityVote = sortedOptions[0][0];
    const leastCommonVote = sortedOptions[sortedOptions.length - 1][0];

    // Assign points
    let updatedPlayers = [...players];
    updatedPlayers.forEach((player) => {
      const playerVote = votes[player.name];
      if (playerVote === majorityVote) {
        player.points += 3; // Majority gets 3 points
      } else if (playerVote === leastCommonVote) {
        player.points += 1; // Least common gets 1 point
      }
    });

    setPlayers(updatedPlayers); // Update players with their points
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <button
        onClick={handleStartGame}
        className="game-mode-btn bg-blue-600 text-white p-3 rounded"
        disabled={gameStarted}  // Disable the button once the game has started
      >
        {gameStarted ? "Game Started" : "Start Majority Rules"}
      </button>
      {/* Display current votes */}
      <div className="mt-6">
        <h2>Current Votes:</h2>
        {Object.entries(currentVotes).map(([player, vote]) => (
          <p key={player}>{player} voted for: {vote}</p>
        ))}
      </div>
    </Layout>
  );
}
