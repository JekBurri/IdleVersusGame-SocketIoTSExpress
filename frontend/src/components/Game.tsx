// Game.tsx
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../App";
import { player } from "./WaitingRoom";

const Game = () => {
  const { gameState } = useContext(GameContext);
  const [playerState, setPlayerState] = useState<player[]>([]);
  const [sellAmount, setSellAmount] = useState("");
  const yourPlayer = playerState.find(
    (player: any) => player.user === gameState.user
  );

  useEffect(() => {
    if (gameState.socket) {
      console.log("Waiting in game state");

      gameState.socket.emit("fetchState");

      gameState.socket.on("getPlayerState", (state: player[]) => {
        // @ts-ignore
        setPlayerState(state.players);
        console.log(
          "YA YEET" +
            playerState[
              playerState.findIndex((p: any) => p.user === gameState.user)
            ]
        );
        // console.log(JSON.stringify(state));
      });
    }
  }, [gameState.socket]);

  const handleAction = (action: string) => {
    gameState.socket.emit("action", action, gameState.user);
  };

  const handleSell = (material: string) => {
    // Implement sell logic here
    console.log(`Selling ${material}`);
    gameState.socket.emit("sell", material, sellAmount, gameState.user)
  };

  const handleBuild = (buildingType: string) => {
    // Implement build logic here
    console.log(`Building ${buildingType}`);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Left Sidebar */}
      <div className="flex justify-center">
        {/* Players Sidebar */}
        <div className="bg-gray-800 m-4 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Players</h2>
          {playerState
            .filter((player) => player.user !== gameState.user)
            .map((player, index) => (
              <div key={player.user} className={index === 0 ? "mb-6" : "mb-4"}>
                <div className="flex items-center">
                  <img
                    src={`https://picsum.photos/200/300?random=${index}`}
                    alt={player.user}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div className="flex flex-col">
                    <p
                      className={`font-semibold text-lg mb-1 ${
                        player.user === gameState.user
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                    >
                      {player.user}
                    </p>
                    {/* Attack Player Button */}
                    <div className="">
                      <button
                        onClick={() => handleAction("attackPlayer")}
                        className="bg-red-500 text-white p-1 rounded-md"
                      >
                        Attack Player
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      {Object.entries(player.resources).map(
                        ([resource, value]) => (
                          <div
                            key={resource}
                            className="flex items-center mr-4 mb-2 text-white"
                          >
                            <div
                              className={`w-4 h-4 rounded-full mr-2 ${
                                resource === "townGold"
                                  ? "bg-yellow-500"
                                  : resource === "citizens"
                                  ? "bg-green-500"
                                  : resource === "wood"
                                  ? "bg-brown-500"
                                  : resource === "stone"
                                  ? "bg-gray-500"
                                  : resource === "iron"
                                  ? "bg-gray-700"
                                  : resource === "gold"
                                  ? "bg-yellow-400"
                                  : resource === "wheat"
                                  ? "bg-yellow-300"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <p>{`${resource}: ${value}`}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 m-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col justify-between mb-4">
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
          <div className="flex gap-2 mt-2">
            <input
              className="flex justify-center align-middle self-center p-2 rounded-md w-24"
              type="number"
              min="0"
              placeholder="amount"
              value={sellAmount}
              onChange={(e) => {setSellAmount(e.target.value)}}
            />

            <select
              onChange={(e) => handleSell(e.target.value)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md w-24"
            >
              <option value="" disabled selected>
                Item
              </option>
              <option value="wood">Wood</option>
              <option value="stone">Stone</option>
              <option value="iron">Iron</option>
              <option value="gold">Gold</option>
              <option value="wheat">Wheat</option>
            </select>
          </div>
        </div>

        {/* Player Stat UI */}
        <div className="flex justify-between">
          <div className="bg-red-200 p-4 mr-4 flex-1">
            <h2 className="text-xl font-semibold mb-2">Hunger</h2>
            <div className="bg-red-500 h-8 w-full rounded-md relative">
              {yourPlayer && (
                <div
                  className="bg-green-500 h-full rounded-md"
                  style={{
                    width: `${yourPlayer.resources.hunger}%`,
                  }}
                ></div>
              )}
              {yourPlayer && (
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  Your Hunger:{" "}
                  {yourPlayer.resources
                    ? yourPlayer.resources.hunger.toFixed(4)
                    : ""}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-200 p-4 flex-1">
            <h2 className="text-xl font-semibold mb-2">Health</h2>
            <div className="bg-blue-500 h-8 w-full rounded-md relative">
              {yourPlayer && (
                <div
                  className="bg-green-500 h-full rounded-md"
                  style={{
                    width: `${yourPlayer.resources.health}%`,
                  }}
                ></div>
              )}
              {yourPlayer && (
                <p className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  Your Health:{" "}
                  {yourPlayer.resources
                    ? yourPlayer.resources.health.toFixed(4)
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* My stats UI */}
        {yourPlayer && (
          <div className={"mb-4"}>
            <div className="flex items-center">
              <img
                src={`https://picsum.photos/200/300?random=${0}`}
                alt={yourPlayer && yourPlayer.user}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div className="flex flex-col">
                <p className={`font-semibold text-lg mb-1 ${"text-blue-400"}`}>
                  {yourPlayer && yourPlayer.user}
                </p>
                <div className="flex flex-col flex-wrap">
                  {Object.entries(yourPlayer.resources).map(
                    ([resource, value]) =>
                      resource !== "hunger" &&
                      resource !== "health" && (
                        <div
                          key={resource}
                          className="flex items-center mr-4 mb-2 text-white"
                        >
                          <div
                            className={`w-4 h-4 rounded-full mr-2 ${
                              resource === "townGold"
                                ? "bg-yellow-500"
                                : resource === "citizens"
                                ? "bg-green-500"
                                : resource === "wood"
                                ? "bg-brown-500"
                                : resource === "stone"
                                ? "bg-gray-500"
                                : resource === "iron"
                                ? "bg-gray-700"
                                : resource === "gold"
                                ? "bg-yellow-400"
                                : resource === "wheat"
                                ? "bg-yellow-300"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <p>{`${resource}: ${value}`}</p>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
