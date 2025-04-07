// src/GameContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://mr-ds.onrender.com");

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [votes, setVotes] = useState({});
  const [kahootAnswers, setKahootAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [mode, setMode] = useState("majority");
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

 useEffect(() => {
  const tryJoin = () => {
    const storedName = localStorage.getItem("playerName");
    console.log("📞 [GameContext] tryJoin — emitting player-join for:", storedName);
    if (storedName && storedName.trim() !== "") {
      setPlayerName(storedName);
      socket.emit("player-join", storedName);
    } else {
      console.warn("❌ No stored player name found on connect.");
    }
  };

  if (socket.connected) {
    tryJoin();
  } else {
    socket.on("connect", tryJoin);
  }

  return () => {
    socket.off("connect", tryJoin);
  };
}, []);




  useEffect(() => {
  const handleGameState = (state) => {
    console.log("Game state received from server:", state);
    console.log("📥 [GameContext] handleGameState received:", state);
    console.log("🙋 [GameContext] playerName state before update:", playerName);

    setPlayers(state.players || []);
    setVotes(state.votes || {});
    setQuestionIndex(state.currentQuestionIndex || 0);
    setMode(state.gameMode || "majority");
    setQuestions(state.questions || []);
    if (state.step !== "done") {
  setLeaderboard((state.players || []).slice().sort((a, b) => b.score - a.score));
}

    if (state.step === -1) {
      console.log("🔁 [GameContext] step === -1 — checking if playerName should be reset");
      if (step !== -1 && playerName) {
        console.log("❌ [GameContext] Resetting playerName due to full reset");
        setPlayerName("");
        localStorage.removeItem("playerName");
      }
      setStep(-1);
    } else {
      // ✅ Restore playerName from localStorage if it's missing in memory
      const stored = localStorage.getItem("playerName");
      if (!playerName && stored) {
        console.log("🔄 [GameContext] Restoring playerName from localStorage:", stored);
        setPlayerName(stored);
      }

      if (state.step === "done") {
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
  socket.on("updateKahootAnswers", (data) => {
    setKahootAnswers(data || {});
  });
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
        kahootAnswers, // ✅ added to context
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
