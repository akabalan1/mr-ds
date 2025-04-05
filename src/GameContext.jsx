import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

// Initialize socket
const socket = io("https://mr-ds.onrender.com");  // Ensure this is the correct server URL

const GameContext = createContext();

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState(""); // Ensure this is initialized
  const [votes, setVotes] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [step, setStep] = useState(-1);
  const [mode, setMode] = useState("majority");
  const [tally, setTally] = useState({});
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Handle socket connection and game state updates
  useEffect(() => {
    // Listen for game state updates from the server
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
        setStep(-1);  // Start screen
      } else {
        setStep(state.questionIndex);
      }
    });

    // Cleanup: disconnect socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [questions]); // You might want to trigger it on different dependencies if needed

  // Functions for interacting with the socket
  const addPlayer = (name) => {
    socket.emit("join", name); // Send the player's name to the server
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
    setMode(newMode); // Update local state to reflect the mode change
    socket.emit("changeMode", newMode); // Notify the server
  };

  return (
    <GameContext.Provider
      value={{
        players,
        playerName, // Provide player name state
        setPlayerName, // Allow components to set player name
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
        showResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
