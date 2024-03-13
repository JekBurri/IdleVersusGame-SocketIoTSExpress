// Game.tsx
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../App";
import { player } from "./WaitingRoom";

const Game = () => {
  const { gameState, setGameState } = useContext(GameContext);
  const [playerState, setPlayerState] = useState<player[]>([]);
  useEffect(() => {
    if (gameState.socket) {
      console.log("Waiting in game state");

      gameState.socket.emit("fetchState");

      gameState.socket.on("getPlayerState", (state: player[]) => {
        // @ts-ignore
        setPlayerState(state.players);
        console.log(JSON.stringify(state));
      });
    }
  }, [gameState.socket]);

  const [currentPlayerStats, setCurrentPlayerStats] = useState({
    // make a function to get the current player
  });
  

  const handleAction = (action: string) => {
    // Implement action logic here
    
    gameState.socket.emit("action", action, gameState.user);
  };

  const handleSell = (material: string) => {
    // Implement sell logic here
    console.log(`Selling ${material}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="flex">
        {/* Players Sidebar */}
        <div className="bg-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Players</h2>
          {playerState.map((player, index) => (
            <div key={player.user} className={index === 0 ? "mb-6" : "mb-4"}>
              <img
                src={"https://picsum.photos/200/300"}
                alt={player.user}
                className={
                  index === 0
                    ? "w-20 h-20 rounded-full mb-2"
                    : "w-10 h-10 rounded-full mr-2"
                }
              />
              <div className="flex flex-col">
                <p
                  className={`font-semibold text-lg mb-1 ${
                    index === 0 ? "text-blue-600" : "text-black"
                  }`}
                >
                  {player.user}
                </p>
                {index === 0 ? (
                  <div className="flex flex-col text-gray-700">
                    <p>Town Gold: {player.resources.townGold}</p>
                    <p>Citizens: {player.resources.citizens}</p>
                    <p>Wood: {player.resources.wood}</p>
                    <p>Stone: {player.resources.stone}</p>
                    <p>Iron: {player.resources.iron}</p>
                    <p>Gold: {player.resources.gold}</p>
                    <p>Wheat: {player.resources.wheat}</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <p>Town Gold: {player.resources.townGold}</p>
                    <p>Citizens: {player.resources.citizens}</p>
                    <p>Wood: {player.resources.wood}</p>
                    <p>Stone: {player.resources.stone}</p>
                    <p>Iron: {player.resources.iron}</p>
                    <p>Gold: {player.resources.gold}</p>
                    <p>Wheat: {player.resources.wheat}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="flex justify-between mb-4">
          {/* Action Buttons */}
          <div>
            <button
              onClick={() => handleAction("wood")}
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Chop Wood
            </button>
            <button
              onClick={() => handleAction("stone")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Mine Stone
            </button>
            <button
              onClick={() => handleAction("iron")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Mine Iron
            </button>
            <button
              onClick={() => handleAction("gold")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Mine Gold
            </button>
            <button
              onClick={() => handleAction("wheat")}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Harvest Wheat
            </button>
          </div>

          {/* Shop UI */}
          <div>
            <div className="flex">
              <h2 className="text-xl font-semibold mb-2">Shop</h2>
              <input
                className="flex justify-center align-middle self-center border-black border-2 p-2 rounded-md"
                type="text"
                placeholder="amount?"
              />
            </div>
            <button
              onClick={() => handleSell("Wood")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Sell Wood
            </button>
            <button
              onClick={() => handleSell("Stone")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Sell Stone
            </button>
            <button
              onClick={() => handleSell("Iron")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Sell Iron
            </button>
            <button
              onClick={() => handleSell("Gold")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Sell Gold
            </button>
            <button
              onClick={() => handleSell("Wheat")}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Sell Wheat
            </button>
          </div>
        </div>

        {/* Civilization UI */}
        <div className="bg-blue-200 p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Your Civilization</h2>
          {/* Add your civilization components here */}
          {/* This will be flex icons of the types of buildings, etc */}
        </div>

        {/* Player Stat UI */}
        <div className="flex justify-between">
          <div className="bg-red-200 p-4 mr-4 flex-1">
            <h2 className="text-xl font-semibold mb-2">Hunger</h2>
            <div className="bg-red-500 h-8 w-full rounded-md relative">
              <div
                className="bg-green-500 h-full rounded-md"
                style={{ width: `${currentPlayerStats.hunger}%` }}
              ></div>
              <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {currentPlayerStats.hunger}
              </p>
            </div>
          </div>

          <div className="bg-blue-200 p-4 flex-1">
            <h2 className="text-xl font-semibold mb-2">Health</h2>
            <div className="bg-blue-500 h-8 w-full rounded-md relative">
              <div
                className="bg-green-500 h-full rounded-md"
                style={{ width: `${currentPlayerStats.health}%` }}
              ></div>
              <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                {currentPlayerStats.health}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
