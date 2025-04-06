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
  gameMode: "majority", // default
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
    gameState.leaderboard = [];
    gameState.players.forEach((p) => (p.score = 0));
    io.emit("gameState", gameState);
  });

  socket.on("submitVote", ({ name, option, questionIndex }) => {
    gameState.votes[name] = option;
    io.emit("updateVotes", gameState.votes);
  });

  socket.on("calculateMajorityScores", () => {
    console.log("📤 Emitting updated gameState:", gameState);
    const votes = gameState.votes;
    const optionCounts = {};

    for (let player in votes) {
      const vote = votes[player];
      optionCounts[vote] = (optionCounts[vote] || 0) + 1;
    }

    const sortedOptions = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
    const majorityVote = sortedOptions[0] ? sortedOptions[0][0] : null;
    const leastCommonVote = sortedOptions[sortedOptions.length - 1] ? sortedOptions[sortedOptions.length - 1][0] : null;

    gameState.players.forEach((player) => {
      const vote = votes[player.name];
      if (vote === majorityVote) {
        player.score += 3;
      } else if (vote === leastCommonVote) {
        player.score += 1;
      } else {
        player.score += 2;
      }
    });

    gameState.votes = {};
    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex >= gameState.questions.length) {
      gameState.step = "done";
      gameState.leaderboard = [...gameState.players].sort((a, b) => b.score - a.score);
      io.emit("showResults", gameState);
    } else {
      io.emit("gameState", gameState);
    }
  });

  socket.on("resetGame", () => {
    console.log("🔄 Resetting game state");
    gameState = {
      players: [],
      votes: {},
      gameMode: "majority",
      questions: [],
      currentQuestionIndex: 0,
      leaderboard: [],
      step: -1
    };
    io.emit("gameState", gameState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("🚀 Server listening on port", PORT);
});
