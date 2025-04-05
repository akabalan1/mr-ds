import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../GameContext";
import Layout from "../components/Layout"; 

export default function PlayerMajority() {
  const navigate = useNavigate();
  const { step, gameMode, votes, setVotes, socket } = useGame();

  useEffect(() => {
    socket.on("gameState", (state) => {
      setVotes(state.votes); // Set the votes based on current game state
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
        <button onClick={() => handleVote("Option 1")}>Option 1</button>
        <button onClick={() => handleVote("Option 2")}>Option 2</button>
        <button onClick={() => handleVote("Option 3")}>Option 3</button>
        <button onClick={() => handleVote("Option 4")}>Option 4</button>
      </div>
    </Layout>
  );
}
