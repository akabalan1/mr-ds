import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useGame } from "../GameContext";
import { useNavigate } from "react-router-dom";

export default function PlayerKahoot() {
  const { step, gameMode, socket } = useGame();
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0); // To track time taken for answering
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    socket.on("gameState", (state) => {
      setCurrentQuestion(state.questionIndex); // Update question index
    });

    socket.on("timerUpdate", (timeRemaining) => {
      setTimer(timeRemaining); // Update timer
    });

    return () => {
      socket.off("gameState");
      socket.off("timerUpdate");
    };
  }, [socket]);

  const handleAnswer = (answer) => {
    // Calculate time-based scoring
    const timeFactor = Math.max(0, 10 - timer); // Example: if answered faster, higher points (max 10 points)
    const correctAnswer = "Paris"; // You would get the correct answer from game state
    let points = 0;

    if (answer === correctAnswer) {
      points = Math.max(10 - timeFactor, 1); // Max points for correct answers, decreasing with time
    }

    socket.emit("submitAnswer", { answer, points });
  };

  return (
    <Layout>
      <h1>Player Kahoot Game</h1>
      <div>
        <h2>Question {step + 1}</h2>
        {/* Example Answer Buttons */}
        <button onClick={() => handleAnswer("Paris")}>Paris</button>
        <button onClick={() => handleAnswer("London")}>London</button>
        <button onClick={() => handleAnswer("Rome")}>Rome</button>
        <button onClick={() => handleAnswer("Berlin")}>Berlin</button>
      </div>
      <div className="timer">
        <h3>Time Remaining: {timer}s</h3>
      </div>
    </Layout>
  );
}
