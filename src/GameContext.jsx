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
    console.log("📥 [GameContext] gameState received:", state);

    // 🔄 Always sync these
    setPlayers(state.players || []);
    setVotes(state.votes || {});
    setQuestions(state.questions || []);
    setMode(state.gameMode || "majority");
    setQuestionIndex(state.currentQuestionIndex || 0);

    // 🧼 Reset kahootAnswers if server cleared them
    if (!state.kahootAnswers || Object.keys(state.kahootAnswers).length === 0) {
      setKahootAnswers({});
    }

    // 🏆 Only recalculate leaderboard when not done
    if (state.step !== "done") {
      setLeaderboard([...state.players].sort((a, b) => b.score - a.score));
    }

    // 🔁 Full reset case
    if (state.step === -1) {
      console.log("🔄 step === -1 → clearing playerName + local state");
      if (step !== -1 && playerName) {
        setPlayerName("");
        localStorage.removeItem("playerName");
      }
      setStep(-1);
      return;
    }

    // 💾 Restore local playerName if missing
    const storedName = localStorage.getItem("playerName");
    if (!playerName && storedName) {
      console.log("🔁 Restoring playerName from localStorage:", storedName);
      setPlayerName(storedName);
    }

    // ✅ Set correct game step
    if (state.step === "done") {
      setStep("done");
    } else if (
      Array.isArray(state.questions) &&
      state.currentQuestionIndex >= state.questions.length
    ) {
      setStep("done");
    } else if (typeof state.step === "number") {
      if (state.step === 0 && (!state.questions || state.questions.length === 0)) {
        setStep(-1); // Invalid ghost start
      } else {
        setStep(state.step);
      }
    }
  };

  const handleShowResults = (state) => {
    console.log("🎯 showResults received:", state);
    setPlayers(state.players || []);
    setLeaderboard(state.leaderboard || []);
    setQuestionIndex(state.currentQuestionIndex || 0);
    setStep("done");
  };

  const handleUpdateKahootAnswers = (data) => {
    setKahootAnswers(data || {});
    const currentIndex = questionIndex;
    const syncedVotes = {};
    Object.entries(data || {}).forEach(([name, answers]) => {
      if (answers[currentIndex]?.answer) {
        syncedVotes[name] = answers[currentIndex].answer;
      }
    });
    setVotes(syncedVotes);
  };

  socket.on("gameState", handleGameState);
  socket.on("showResults", handleShowResults);
  socket.on("updateKahootAnswers", handleUpdateKahootAnswers);
  socket.on("updateVotes", (data) => {
    console.log("📥 updateVotes received:", data);
    setVotes(data || {});
  });

  return () => {
    socket.off("gameState", handleGameState);
    socket.off("showResults", handleShowResults);
    socket.off("updateKahootAnswers", handleUpdateKahootAnswers);
    socket.off("updateVotes");
  };
}, [playerName, step, questionIndex]);



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


  const submitKahootAnswer = (name, option, time, index) => {
    const finalIndex = index ?? questionIndex;
    console.log("📤 submitKahootAnswer:", { name, option, time, questionIndex: finalIndex });
    socket.emit("submitKahoot", { name, option, time, questionIndex: finalIndex });
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
