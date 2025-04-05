const io = require("socket.io")(server);

let gameState = {
  players: [],
  votes: {},
  questionIndex: 0,
  gameMode: "majority" // default
};

function emitGameState() {
  io.emit("gameState", {
    players: gameState.players,
    votes: gameState.votes,
    questionIndex: gameState.questionIndex,
    gameMode: gameState.gameMode
  });
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Emit initial game state when a player joins
  socket.emit("gameState", gameState);

  // Handle player joining
  socket.on("player-join", (name) => {
    if (!name) return;
    const existing = gameState.players.find(p => p.name === name);
    if (!existing) {
      gameState.players.push({ name, score: 0 });
    }
    console.log(`Player joined: ${name}`);
    emitGameState();
  });

  // Handle reset game event from admin
  socket.on("resetGame", () => {
    console.log("Resetting game state");
    gameState = {
      players: [],
      votes: {},
      questionIndex: 0,
      gameMode: "majority"
    };
    emitGameState();
  });

  // Optionally handle disconnects
  socket.on("disconnect", () => {
    gameState.players = gameState.players.filter(p => p.socketId !== socket.id);
    console.log("Player disconnected", socket.id);
    emitGameState();
  });
});
