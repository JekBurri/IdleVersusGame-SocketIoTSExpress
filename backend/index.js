const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const port = 3000;

let gameData = {
  players: [],
};

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

  socket.on("joingame", (username) => {
    if (gameData.players.length < 4) {
      gameData.players.push({
        user: username,
        resources: {
          citizens: 0,
          townGold: 0,
          wood: 0,
          stone: 0,
          wheat: 0,
          gold: 0,
          iron: 0,
          health:100,
          hunger:100,
        }
      });
      io.emit("updateroom", gameData);
    } else {
      socket.emit("roomisfull");
    }
  });

  socket.on("updatePlayer", (player, data) => {

  })

  socket.on("fetchState", () => {
    socket.emit("getPlayerState", gameData);
  })

  socket.on("action", (action, player) => {
    

    // Find the index of the player in the gameData.players array
    const playerIndex = gameData.players.findIndex(p => p.user === player);

    // Check if the player is found in the array
    if (playerIndex !== -1) {
        // Increment the specified resource for the player
        gameData.players[playerIndex].resources[action] += 1;
        console.log(gameData.players[playerIndex])

        // Emit the updated gameData to the client(s)
        io.emit("getPlayerState", gameData);
    }
  })


});

server.listen(port, () => {
  console.log("listening on port " + port);
});
