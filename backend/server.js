// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let gameState = {
  players: [],
  votes: {},
  kahootAnswers: {},
  gameMode: "majority",
  questions: [],
  currentQuestionIndex: 0,
  leaderboard: [],
  step: -1
};

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("player-join", (name) => {
    console.log(`📥 player-join received from "${name}"`);
    if (!gameState.players.find((p) => p.name === name)) {
      gameState.players.push({ name, score: 0 });
    }
    console.log("👥 Updated players list:", gameState.players.map(p => p.name));
    io.emit("gameState", gameState);
  });

  socket.on("gameStart", ({ questions, gameMode }) => {
    console.log(`🟢 Game starting in "${gameMode}" mode with questions:`, questions);
    gameState.questions = questions;
    gameState.gameMode = gameMode;
    gameState.currentQuestionIndex = 0;
    gameState.step = 0;
    gameState.votes = {};
    gameState.kahootAnswers = {};
    gameState.leaderboard = [];
    gameState.players.forEach((p) => (p.score = 0));
    io.emit("gameState", gameState);
  });

  socket.on("submitVote", ({ name, option, questionIndex }) => {
    console.log("🧾 Received vote:", { name, option, questionIndex });
    if (!name || typeof name !== "string" || name.trim() === "") {
      console.warn("⚠️ Invalid vote received with missing name");
      return;
    }
    const playerExists = gameState.players.some((p) => p.name === name);
    if (!playerExists) {
      console.warn(`❌ Vote rejected: "${name}" is not a registered player`);
      return;
    }
    if (!gameState.votes[questionIndex]) {
      gameState.votes[questionIndex] = {};
    }
    gameState.votes[questionIndex][name] = option;
    console.log(`🗳 Vote received for Q${questionIndex}:`, gameState.votes[questionIndex]);
    io.emit("updateVotes", gameState.votes[questionIndex]);
  });

  socket.on("submitKahoot", ({ name, option, time, questionIndex }) => {
    console.log("🧠 Kahoot answer received:", { name, option, time, questionIndex });
    if (!name || !option || typeof time !== "number") {
      console.warn("⚠️ Invalid Kahoot submission");
      return;
    }
    if (!gameState.kahootAnswers[name]) {
      gameState.kahootAnswers[name] = {};
    }
    gameState.kahootAnswers[name][questionIndex] = { answer: option, time };
    // ✅ Emit updateVotes to simulate submission tally (used for ✅/⏳ icons in Admin UI)
  const simulatedVotes = {};
  for (const playerName in gameState.kahootAnswers) {
    const answerObj = gameState.kahootAnswers[playerName][questionIndex];
    if (answerObj?.answer) {
      simulatedVotes[playerName] = answerObj.answer;
    }
  }

  io.emit("updateVotes", simulatedVotes);
  });

  socket.on("calculateMajorityScores", () => {
    console.log("📊 Calculating scores for question", gameState.currentQuestionIndex);
    const votes = gameState.votes[gameState.currentQuestionIndex] || {};
    const optionCounts = {};
    gameState.players.forEach((player) => {
      if (!votes[player.name]) {
        votes[player.name] = null;
      }
    });
    Object.values(votes).forEach((vote) => {
      if (vote) {
        optionCounts[vote] = (optionCounts[vote] || 0) + 1;
      }
    });
    const voteCounts = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
    const highestCount = voteCounts[0]?.[1] || 0;
    const lowestCount = voteCounts[voteCounts.length - 1]?.[1] || 0;
    const majorityVotes = voteCounts.filter(([_, count]) => count === highestCount).map(([opt]) => opt);
    const leastVotes = voteCounts.filter(([_, count]) => count === lowestCount).map(([opt]) => opt);

    gameState.players.forEach((player) => {
      const vote = votes[player.name];
      if (!vote) return;
      if (majorityVotes.length === 1 && vote === majorityVotes[0]) {
        player.score += 3;
      } else if (leastVotes.length === 1 && vote === leastVotes[0]) {
        player.score += 1;
      } else {
        player.score += 2;
      }
    });

    delete gameState.votes[gameState.currentQuestionIndex];
    advanceGame();
  });

  socket.on("calculateKahootScores", () => {
    console.log("🎯 Calculating Kahoot scores for Q", gameState.currentQuestionIndex);
    const correctAnswer = gameState.questions[gameState.currentQuestionIndex]?.correctAnswer;
    if (!correctAnswer) {
      console.warn("❗ No correct answer defined for current question");
      return;
    }
    gameState.players.forEach((player) => {
      const answerData = gameState.kahootAnswers[player.name]?.[gameState.currentQuestionIndex];
      if (!answerData) return;
      if (answerData.answer === correctAnswer) {
        const timeBonus = Math.max(0, Math.min(15, answerData.time));
        const score = 1000 + timeBonus * 20;
        player.score += score;
        console.log(`✅ ${player.name} answered correctly in ${answerData.time}s, score +${score}`);
      } else {
        console.log(`❌ ${player.name} answered incorrectly.`);
      }
    });
    advanceGame();
  });

  socket.on("resetGame", () => {
    console.log("🔄 Resetting game state");
    gameState = {
      players: [],
      votes: {},
      kahootAnswers: {},
      gameMode: "majority",
      questions: [],
      currentQuestionIndex: 0,
      leaderboard: [],
      step: -1
    };
    io.emit("gameState", gameState);
  });
});

function advanceGame() {
  const nextIndex = gameState.currentQuestionIndex + 1;

  if (nextIndex >= gameState.questions.length) {
    gameState.step = "done";
    gameState.leaderboard = [...gameState.players].sort((a, b) => b.score - a.score);
    io.emit("showResults", gameState);
  } else {
    gameState.currentQuestionIndex = nextIndex;
    gameState.step = nextIndex;
    io.emit("gameState", gameState);
  }
}


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("🚀 Server listening on port", PORT);
});
