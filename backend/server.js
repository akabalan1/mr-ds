// backend/server.js
const io = require("socket.io")(server);

let gameState = {
  players: [],
  votes: {},
  questionIndex: 0,
  gameMode: "majority", // default
  questions: []
};

function emitGameState() {
  io.emit("gameState", {
    players: gameState.players,
    votes: gameState.votes,
    questionIndex: gameState.questionIndex,
    gameMode: gameState.gameMode,
    questions: gameState.questions
  });
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Emit initial game state when a client connects
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

  // Handle game start (for both Kahoot and Majority)
  socket.on("gameStart", (data) => {
    // data: { questions: [...], gameMode: "kahoot" or "majority" }
    gameState.questions = data.questions;
    gameState.gameMode = data.gameMode;
    gameState.questionIndex = 0;
    console.log("Game started with questions:", gameState.questions);
    emitGameState();
  });

  // Handle next question event
  socket.on("nextQuestion", (nextQuestionIndex) => {
    gameState.questionIndex = nextQuestionIndex;
    console.log("Next question index:", nextQuestionIndex);
    emitGameState();
  });

  // Handle Kahoot answer submissions
  socket.on("submitKahoot", ({ name, option, time, questionIndex }) => {
    const question = gameState.questions[questionIndex];
    if (!question) return;
    // Award points only if the answer is correct.
    if (option === question.correctAnswer) {
      // Example: max 10 points minus the time factor (ensuring at least 1 point)
      const points = Math.max(10 - time, 1);
      const player = gameState.players.find(p => p.name === name);
      if (player) {
        player.score += points;
      }
    }
    emitGameState();
  });

  // Handle vote submissions for Majority Rules
  socket.on("submitVote", ({ name, option, questionIndex }) => {
    gameState.votes[name] = option;
    emitGameState();
  });

  // When admin wants to calculate majority scores at the end of a question
  socket.on("calculateMajorityScores", () => {
    const votes = gameState.votes;
    const optionCounts = {};
    for (let player in votes) {
      const vote = votes[player];
      optionCounts[vote] = (optionCounts[vote] || 0) + 1;
    }
    const sortedOptions = Object.entries(optionCounts).sort((a, b) => b[1] - a[1]);
    const majorityVote = sortedOptions[0] ? sortedOptions[0][0] : null;
    const leastCommonVote = sortedOptions[sortedOptions.length - 1] ? sortedOptions[sortedOptions.length - 1][0] : null;

    gameState.players.forEach(player => {
      const vote = votes[player.name];
      if (vote === majorityVote) {
        player.score += 3;
      } else if (vote === leastCommonVote) {
        player.score += 1;
      } else {
        player.score += 2;
      }
    });
    // Clear votes for next question.
    gameState.votes = {};
    emitGameState();
  });

  // Handle game reset
  socket.on("resetGame", () => {
    console.log("Resetting game state");
    gameState = {
      players: [],
      votes: {},
      questionIndex: 0,
      gameMode: "majority",
      questions: []
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
