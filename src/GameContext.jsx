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
  const tryJoin = () => {
    const storedName = localStorage.getItem("playerName");
    if (storedName && storedName.trim() !== "") {
      console.log("✅ Auto-rejoining with:", storedName);
      setPlayerName(storedName);
      socket.emit("player-join", storedName);
    }
  };

  if (socket.connected) {
    tryJoin();
  } else {
    socket.once("connect", tryJoin);
  }

  return () => {
    socket.off("connect", tryJoin);
  };
}, []);



  useEffect(() => {
    const handleGameState = (state) => {
      console.log("Game state received from server:", state);
      setPlayers(state.players || []);
      setVotes(state.votes || {});
      setQuestionIndex(state.currentQuestionIndex || 0);
      setMode(state.gameMode || "majority");
      setQuestions(state.questions || []);
      setLeaderboard((state.players || []).slice().sort((a, b) => b.score - a.score));

      if (state.step === -1) {
        setStep(-1);
        if (playerName) {
          setPlayerName("");
          localStorage.removeItem("playerName");
        }
      } else if (state.step === "done") {
        setStep("done");
      } else if (
        state.questions &&
        state.questions.length > 0 &&
        state.currentQuestionIndex >= state.questions.length
      ) {
        setStep("done");
      } else if (typeof state.step === "number") {
        if (state.step === 0 && (!state.questions || state.questions.length === 0)) {
          setStep(-1);
        } else {
          setStep(state.step);
        }
      }
    };

    const handleShowResults = (state) => {
  console.log("🎯 showResults received from server:", state);
  setPlayers(state.players || []);
  setLeaderboard(state.leaderboard || []);
  setQuestionIndex(state.currentQuestionIndex || 0);
  setStep("done");
};


    socket.on("gameState", handleGameState);
    socket.on("showResults", handleShowResults);

    return () => {
      // Only clean up listeners, DO NOT disconnect socket
      socket.off("gameState", handleGameState);
      socket.off("showResults", handleShowResults);
    };
  }, [playerName]);

  const addPlayer = (name) => {
    socket.emit("player-join", name);
  };

  const submitVote = (name, option) => {
  const finalName = name || localStorage.getItem("playerName") || playerName;
  if (!finalName || typeof finalName !== "string" || finalName.trim() === "") {
    console.warn("🚫 Cannot submit vote: Missing player name");
    return;
  }

  console.log("📤 Submitting vote:", finalName, "=>", option);
  socket.emit("submitVote", { name: finalName, option, questionIndex });
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
