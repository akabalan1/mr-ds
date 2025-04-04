
import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "./socket";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [step, setStep] = useState(-1);
  const [votes, setVotes] = useState({});
  const [tally, setTally] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    {
      text: "What’s the best date night activity?",
      options: ["Dinner", "Netflix & Chill", "Game Night", "Long Walk"]
    },
    {
      text: "Who usually says 'I love you' first?",
      options: ["Her", "Him", "Neither", "At the same time"]
    }
  ];

  useEffect(() => {
    socket.on("gameState", (state) => {
      console.log("↪ Game state received from server:", state);
      setPlayers(state.players || []);
      setVotes(state.votes || {});

      if (typeof state.questionIndex === "number") {
        setQuestionIndex(state.questionIndex);

        if (
          state.questionIndex === 0 &&
          (!state.votes || Object.keys(state.votes).length === 0) &&
          (!state.players || state.players.length === 0)
        ) {
          setStep(-1); // intro screen
        } else if (state.questionIndex >= questions.length) {
          setStep("done");
        } else {
          setStep(state.questionIndex);
        }
      }
    });

    socket.on("voteUpdate", (voteArray) => {
      setVotes(prevVotes => {
        const updated = { ...prevVotes };
        updated[questionIndex] = voteArray;
        return updated;
      });
    });

    socket.emit("getGameState");
  }, []);

  const addPlayer = (name) => {
    if (!players.find((p) => p.name === name)) {
      setPlayers([...players, { name, score: 0 }]);
    }
    socket.emit("addPlayer", name);
  };

  const submitVote = (playerName, option) => {
    const updated = { ...votes };
    if (!updated[questionIndex]) updated[questionIndex] = [];
    updated[questionIndex].push({ playerName, option });
    setVotes(updated);
    socket.emit("vote", { name: playerName, option });
  };

  const calculateTally = () => {
    const currentVotes = votes[questionIndex] || [];
    const count = {};
    currentVotes.forEach(({ option }) => {
      count[option] = (count[option] || 0) + 1;
    });
    setTally(count);

    let max = 0;
    let majorityOption = null;
    for (const option in count) {
      if (count[option] > max) {
        max = count[option];
        majorityOption = option;
      }
    }

    const updatedPlayers = players.map((p) => {
      const playerVote = currentVotes.find((v) => v.playerName === p.name);
      if (playerVote && playerVote.option === majorityOption) {
        return { ...p, score: p.score + 1 };
      }
      return p;
    });
    setPlayers(updatedPlayers);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
      setTally({});
    } else {
      setStep("done");
    }
  };

  const resetGame = () => {
    setPlayers([]);
    setStep(-1);
    setVotes({});
    setTally({});
    setQuestionIndex(0);
  };

  return (
    <GameContext.Provider
      value={{
        players,
        step,
        setStep,
        addPlayer,
        questions,
        questionIndex,
        submitVote,
        calculateTally,
        tally,
        nextQuestion,
        votes,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
