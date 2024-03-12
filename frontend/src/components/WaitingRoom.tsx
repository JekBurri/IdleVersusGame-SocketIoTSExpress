import { useContext, useEffect, useState } from "react";
import { GameContext } from "../App";

export type player = {
  user: string;
  resources: {
    citizens: number;
    townGold: number;
    wood: number;
    stone: number;
    wheat: number;
    gold: number;
    iron: number;
    health: number;
    hunger: number;
  };
};


function WaitingRoom() {
  const { gameState, setGameState } = useContext(GameContext);
  const [playerList, setPlayerList] = useState<player[]>([]);

  useEffect(() => {
    if (gameState.socket) {
      console.log("Waiting");
      gameState.socket.emit("getplayerlist");

      gameState.socket.on("getplayerlist", (playerlist: any) => {
        setPlayerList(playerlist);
      });

      gameState.socket.on("roomisfull", () => {
        alert("Game is full, sorry there is a maximum of 4 players for now.");
      });
    }
  }, [gameState.socket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-gray-200 p-4 rounded-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Player List</h2>
        {playerList.map((player, index) => (
          <div
          key={index}
          className={`border border-gray-400 p-2 rounded-md mb-2 ${
            gameState.user === player.user ? 'font-bold text-red-500' : ''
          }`}
        >
            {player.user}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setGameState((prev: any) => ({
            ...prev,
            view: "game",
          }));
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Start Game
      </button>
    </div>
  );
}

export default WaitingRoom;
