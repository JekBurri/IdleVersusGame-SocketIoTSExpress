const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = 3000;

let gameData = {
  players: [],
};

let goldValue = 1;
setInterval(() => {
  goldValue = Math.floor(Math.random() * (5 - 1) + 1);
},200)

const playerDataTemplate = {
  citizens: 0,
  townGold: 0,
  wood: 0,
  stone: 0,
  wheat: 0,
  gold: 0,
  iron: 0,
};

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Web Sockets Connected");

  socket.on("getplayerlist", () => {
    console.log(gameData.players);
    io.emit("getplayerlist", gameData.players);
  });

  socket.on('disconnect', () => {
    // Find the index of the player with the disconnecting socket ID
    const disconnectingPlayerIndex = gameData.players.findIndex(player => player.socketId === socket.id);
  
    if (disconnectingPlayerIndex !== -1) {
      // Remove the player from the array
      gameData.players.splice(disconnectingPlayerIndex, 1);
      console.log(`User with socket ID ${socket.id} disconnected`);
      io.emit('updateroom', gameData);
    } else {
      console.log('User disconnected, but not found in the player list');
    }
  });

  socket.on("joingame", (username) => {
    if (gameData.players.length < 4) {
      gameData.players.push({
        user: username,
        socketId: socket.id,  // Store the unique socket ID
        resources: {
          citizens: 10,
          townGold: 100,
          wood: 0,
          stone: 0,
          wheat: 0,
          gold: 0,
          iron: 0,
          health: 100,
          hunger: 100,
        },
      });
      io.emit("updateroom", gameData);
    } else {
      socket.emit("roomisfull");
    }
  });

  socket.on("updatePlayer", (player, data) => {});

  socket.on("fetchState", () => {
    socket.emit("getPlayerState", gameData);
  });

  socket.on("action", (action, player) => {
    const playerIndex = gameData.players.findIndex(p => p.user === player);
    switch (action) {
      case "wood":
        gameData.players[playerIndex].resources.hunger -= 0.2;
        break;
      case "iron":
        gameData.players[playerIndex].resources.hunger -= 0.7;
        break;
      case "gold":
        gameData.players[playerIndex].resources.hunger -= 2.2;
        break;
      case "wheat":
        gameData.players[playerIndex].resources.hunger -= 0.08;
        break;
      case "stone":
        gameData.players[playerIndex].resources.hunger -= 1;
        break;
      default:
        break;
      }
      gameData.players[playerIndex].resources[action] += 1;
      io.emit("getPlayerState", gameData);

      console.log(gameData.players[playerIndex]);
  });

  socket.on("sell", (action,amount, player) => {
    const playerIndex = gameData.players.findIndex(p => p.user === player);
    
    console.log("Player has this much", gameData.players[playerIndex].resources[action])
    console.log("Player wants to sell this much", amount)
    if(gameData.players[playerIndex].resources[action] < amount) {
      console.log("Not enough resources")
      socket.emit("notEnoughResources", action);
      return;
    } else {
      switch (action) {
        case "wood":
          gameData.players[playerIndex].resources.wood -= amount;
          gameData.players[playerIndex].resources.townGold += (0.2*amount);
          break;
        case "iron":
          gameData.players[playerIndex].resources.iron -= amount;
          gameData.players[playerIndex].resources.townGold += (0.3*amount);
          break;
        case "gold":
          gameData.players[playerIndex].resources.gold -= amount;
          gameData.players[playerIndex].resources.townGold += (goldValue*amount);
          break;
        case "wheat":
          gameData.players[playerIndex].resources.wheat -= amount;
          gameData.players[playerIndex].resources.townGold += (0.2*amount);
          break;
        case "stone":
          gameData.players[playerIndex].resources.stone -= amount;
          gameData.players[playerIndex].resources.townGold += (0.25*amount);
          break;
        default:
          break;
        }
        // gameData.players[playerIndex].resources[action] += 1;
        io.emit("getPlayerState", gameData);
  
        console.log(gameData.players[playerIndex]);
    }

  });

  
});



server.listen(port, () => {
  console.log("listening on port " + port);
});
