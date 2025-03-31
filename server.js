
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let gameState = {
  players: [],
  votes: {},
  questionIndex: 0
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (name) => {
    if (!gameState.players.find(p => p.name === name)) {
      gameState.players.push({ name, score: 0 });
    }
    console.log("Player joined:", name);
    io.emit('gameState', gameState);
  });

  socket.on('vote', ({ name, option }) => {
    const qIndex = gameState.questionIndex;
    if (!gameState.votes[qIndex]) gameState.votes[qIndex] = [];
    gameState.votes[qIndex].push({ name, option });
    console.log("Received vote:", { name, option, qIndex });
    console.log("Current votes for Q", qIndex, ":", gameState.votes[qIndex]);
    io.emit('voteUpdate', gameState.votes[qIndex]);
  });

  socket.on('nextQuestion', () => {
    gameState.questionIndex += 1;
    console.log("Advanced to question:", gameState.questionIndex);
    io.emit('nextQuestion', gameState.questionIndex);
  });

  socket.on('resetGame', () => {
    gameState = {
      players: [],
      votes: {},
      questionIndex: 0
    };
    console.log("Game reset.");
    io.emit('gameState', gameState);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
