import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://mr-ds.onrender.com");

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [votes, setVotes] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [mode, setMode] = useState("majority");
  const [tally, setTally] = useState({});
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  // Sync game state with the server
  useEffect(() => {
    socket.on("gameState", (state) => {
      console.log("↪ Game state received from server:", state);
      setPlayers(state.players || []);
      setVotes(state.votes || {});
      setQuestionIndex(state.questionIndex || 0);
      setMode(state.mode || "majority");
      setLeaderboard(state.leaderboard || []);
      if (state.questionIndex >= questions.length) {
        setStep("done");
      } else if (state.questionIndex === 0 && (!state.votes || Object.keys(state.votes).length === 0)) {
        setStep(-1);
      } else {
        setStep(state.questionIndex);
      }
    });

    return () => socket.disconnect();
  }, [questions]);

  const addPlayer = (name) => {
    socket.emit("join", name);
  };

  const submitVote = (name, option) => {
    socket.emit("submitVote", {
      name,
      option,
      questionIndex,
    });
  };

  const submitKahootAnswer = (name, option, time) => {
    socket.emit("submitKahoot", {
      name,
      option,
      time,
      questionIndex,
    });
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
        players,
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
        tally,
        setTally,
        addPlayer,
        submitVote,
        submitKahootAnswer,
        nextQuestion,
        resetGame,
        changeMode,
        showResults
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
