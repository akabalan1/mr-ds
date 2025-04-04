
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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
  questionIndex: 0
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("addPlayer", (name) => {
    if (!gameState.players.find((p) => p.name === name)) {
      gameState.players.push({ name, score: 0 });
      io.emit("gameState", gameState); // broadcast so admin gets it too
    } else {
      // ensure client still gets current state even if already in list
      socket.emit("gameState", gameState);
    }
  });

  socket.on("vote", ({ name, option }) => {
    if (!gameState.votes[gameState.questionIndex]) {
      gameState.votes[gameState.questionIndex] = [];
    }
    gameState.votes[gameState.questionIndex].push({ playerName: name, option });
    io.emit("voteUpdate", gameState.votes[gameState.questionIndex]);
  });

  socket.on("nextQuestion", () => {
    gameState.questionIndex += 1;
    io.emit("nextQuestion", gameState.questionIndex);
    io.emit("gameState", gameState);
  });

  socket.on("getGameState", () => {
    socket.emit("gameState", gameState);
    socket.broadcast.emit("gameState", gameState); // ensure others see new player
  });

  socket.on("resetGame", () => {
    console.log("Game reset by admin");
    gameState = {
      players: [],
      votes: {},
      questionIndex: 0
    };
    io.emit("gameState", gameState);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
