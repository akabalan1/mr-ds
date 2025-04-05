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
  const [step, setStep] = useState(-1); // -1: waiting/join, 0..n: question index, "done": finished
  const [mode, setMode] = useState("majority");
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on("gameState", (state) => {
      console.log("Game state received from server:", state);
      setPlayers(state.players || []);
      setVotes(state.votes || {});
      setQuestionIndex(state.questionIndex || 0);
      setMode(state.gameMode || "majority");
      setQuestions(state.questions || []);

      // Set leaderboard as players sorted by score
      setLeaderboard((state.players || []).slice().sort((a, b) => b.score - a.score));

      if (state.questionIndex === "done" || state.questionIndex >= (state.questions ? state.questions.length : 0)) {
        setStep("done");
      } else if (state.questionIndex === 0 && (!state.votes || Object.keys(state.votes).length === 0)) {
        setStep(-1);
      } else {
        setStep(state.questionIndex);
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
