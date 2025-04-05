
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout"; // Import Layout component

export default function PlayerMajority() {
  const navigate = useNavigate();
  const { step, gameMode, votes, setVotes, socket } = useGame();

  useEffect(() => {
    socket.on("gameState", (state) => {
      // Handle receiving game state, like current votes, question, etc.
      setVotes(state.votes);
    });

    return () => {
      socket.off("gameState");
    };
  }, [socket, setVotes]);

  const handleVote = (option) => {
    const newVote = { player: "Player Name", option: option }; // Replace with actual player name
    socket.emit("submitVote", newVote);
  };

  return (
    <Layout>
      <h1>Player Majority Rules</h1>
      <div>
        <h2>Question {step + 1}</h2>
        {/* Your question and answer options here */}
        <button onClick={() => handleVote("Option 1")}>Option 1</button>
        <button onClick={() => handleVote("Option 2")}>Option 2</button>
      </div>
    </Layout>
  );
}
