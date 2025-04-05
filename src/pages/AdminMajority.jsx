
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext"; // Get game context

export default function AdminMajority() {
  const { gameMode, step, setStep, setPlayers, setVotes, socket } = useGame();

  useEffect(() => {
    // Example of how you might handle a socket event
    socket.on("gameStart", () => {
      setStep(1); // Move to next step, or the first question
    });

    socket.on("updateVotes", (newVotes) => {
      setVotes(newVotes);
    });

    // Reset the game when necessary
    return () => {
      socket.off("gameStart");
      socket.off("updateVotes");
    };
  }, [socket, setStep, setVotes]);

  const handleNextQuestion = () => {
    setStep(step + 1); // Proceed to the next question
    socket.emit("nextQuestion", step + 1);
  };

  return (
    <Layout>
      <h1>Admin Majority Rules</h1>
      <div>
        <button onClick={handleNextQuestion}>Next Question</button>
      </div>
      {/* More game control buttons here */}
    </Layout>
  );
}
