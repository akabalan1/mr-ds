// src/GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://mr-ds.onrender.com");

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [votes, setVotes] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [mode, setMode] = useState("majority");
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
      socket.emit("player-join", storedName);
    }
  }, []);

  useEffect(() => {
    socket.on("gameState", (state) => {
      console.log("Game state received from server:", state);
      setPlayers(state.players || []);
      setVotes(state.votes || {});
      setQuestionIndex(state.currentQuestionIndex || 0);
      setMode(state.gameMode || "majority");
      setQuestions(state.questions || []);
      setLeaderboard((state.players || []).slice().sort((a, b) => b.score - a.score));

      if (state.step === "done") {
  setStep("done");
} else if (
  state.questions &&
  state.questions.length > 0 &&
  state.currentQuestionIndex >= state.questions.length
) {
  setStep("done");
} else if (typeof state.step === "number") {
  // Avoid advancing prematurely if game just started and player just joined
  if (state.step === 0 && state.players.length === 1) {
    setStep(-1); // Treat this like waiting
  } else {
    setStep(state.step);
  }
}


    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addPlayer = (name) => {
    socket.emit("player-join", name);
  };

  const submitVote = (name, option) => {
    socket.emit("submitVote", { name, option, questionIndex });
  };

  const submitKahootAnswer = (name, option, time) => {
    socket.emit("submitKahoot", { name, option, time, questionIndex });
  };

  const nextQuestion = () => {
    socket.emit("nextQuestion");
  };

  const showResults = () => {
    socket.emit("showResults");
  };

  const resetGame = () => {
    socket.emit("resetGame");
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    socket.emit("changeMode", newMode);
  };

  return (
    <GameContext.Provider
      value={{
        socket,
        players,
        playerName,
        setPlayerName,
        votes,
        questionIndex,
        step,
        setStep,
        mode,
        setMode,
        questions,
        setQuestions,
        leaderboard,
        setLeaderboard,
        addPlayer,
        submitVote,
        submitKahootAnswer,
        nextQuestion,
        resetGame,
        changeMode,
        showResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
