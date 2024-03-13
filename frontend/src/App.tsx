import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import WaitingRoom from "./components/WaitingRoom";
import Game from "./components/Game";
export const GameContext = React.createContext<any>(null);

function App() {
  const [socket, setSocket] = useState<any>();
  const initialState = {
    view: "home",
    playerList: [],
  };
  const [gameState, setGameState] = useState<any>(initialState);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const socket = io("ws://localhost:3000");
    setSocket(socket);
    setGameState({ ...gameState, socket });

    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("disconnect", () => {
      socket.disconnect();
    });

    socket.on("updateroom", (room) => {
      console.log(room);
    });
  }, []);

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      <div className="flex m-auto justify-center w-full xl:w-1/2 lg:w-1/2 md:w-3/4 sm:w-full">
        {gameState.view === "home" && (
          <div className="flex flex-col items-center justify-center h-screen">
            <label htmlFor="name" className="text-lg font-semibold mb-4">
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                placeholder="Enter your name"
                name="name"
                maxLength={12}
                className="border border-gray-300 px-2 py-1 rounded-md ml-2 focus:outline-none focus:border-blue-500"
              />
            </label>

            <button
              onClick={() => {
                setGameState({
                  ...gameState,
                  view: "waitingroom",
                  user: username,
                });
                socket.emit("joingame", username);
                console.log(gameState);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Join
            </button>
          </div>
        )}
        {gameState.view === "waitingroom" && <WaitingRoom />}
        {gameState.view === "game" && <Game />}
      </div>
    </GameContext.Provider>
  );
}

export default App;
