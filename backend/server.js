const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let gameState = {
  players: [],
  votes: {},
  questionIndex: 0,
  mode: "majority", // or "kahoot"
  leaderboard: []
};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (playerName) => {
    const newPlayer = { id: socket.id, name: playerName, score: 0 };
    gameState.players.push(newPlayer);
    io.emit("gameState", gameState);
  });

  socket.on("submitVote", (vote) => {
    if (!gameState.votes[gameState.questionIndex]) {
      gameState.votes[gameState.questionIndex] = [];
    }
    gameState.votes[gameState.questionIndex].push(vote);
    io.emit("gameState", gameState);
  });

  socket.on("nextQuestion", () => {
    gameState.questionIndex += 1;
    io.emit("gameState", gameState);
  });

  socket.on("resetGame", () => {
    gameState.votes = {};
    gameState.questionIndex = 0;
    gameState.leaderboard = [];
    io.emit("gameState", gameState);
  });

  socket.on("disconnect", () => {
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    io.emit("gameState", gameState);
  });

  // Send initial state to new client
  socket.emit("gameState", gameState);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});
