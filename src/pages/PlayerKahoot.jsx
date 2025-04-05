
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";

export default function PlayerKahoot() {
  const { step, gameMode, socket } = useGame();
  const [answers, setAnswers] = useState([]);
  
  const handleAnswer = (answer) => {
    socket.emit("submitAnswer", answer);
  };

  return (
    <Layout>
      <h1>Player Kahoot Game</h1>
      <div>
        <h2>Question {step + 1}</h2>
        {/* Example Answer Buttons */}
        <button onClick={() => handleAnswer("A")}>A</button>
        <button onClick={() => handleAnswer("B")}>B</button>
        <button onClick={() => handleAnswer("C")}>C</button>
        <button onClick={() => handleAnswer("D")}>D</button>
      </div>
    </Layout>
  );
}
