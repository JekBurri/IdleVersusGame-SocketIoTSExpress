// Game.tsx
import { useContext, useEffect, useState } from "react";
import { GameContext } from "../App";
import { player } from "./WaitingRoom";

const getResourceImage = (resource: string) => {
  switch (resource) {
    case "townGold":
      return "/townGold.png";
    case "wood":
      return "/wood.png";
    case "stone":
      return "/stone.png";
    case "iron":
      return "/iron.png";
    case "gold":
      return "/gold.png";
    case "wheat":
      return "/wheat.png";
    case "citizens":
      return "/citizens.png";
    case "health":
      return "/health.png";
    case "hunger":
      return "/hunger.png";
  }
};

const Game = () => {
  const { gameState } = useContext(GameContext);
  const [playerState, setPlayerState] = useState<player[]>([]);
  const [sellResource, setSellResource] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [items] = useState([
    {
      name: "Vampiric Scepter",
      description: "Lifesteal 10% of damage dealt",
      image: "/path/to/vampiric_scepter.png",
      price: 200,
    },
    {
      name: "Infinity Edge",
      description: "20% crit chance",
      image: "/path/to/infinity_edge.png",
      price: 300,
    },
    {
      name: "Farmers Hat",
      description: "50% more wheat (upgradable 3 times up to 200% more wheat)",
      upgradeable: true,
      maxUpgrade: 3,
      image: "/path/to/farmers_hat.png",
      price: 400,
    },
    {
      name: "Miners Pickaxe",
      description: "50% more stone (upgradable 3 times up to 200% more stone)",
      upgradeable: true,
      maxUpgrade: 3,
      image: "/path/to/miners_pickaxe.png",
      price: 400,
    },
    {
      name: "Woodcutters Axe",
      description: "50% more wood (upgradable 3 times up to 200% more wood)",
      upgradeable: true,
      maxUpgrade: 3,
      image: "/path/to/woodcutters_axe.png",
      price: 400,
    },
    {
      name: "Iron Pickaxe",
      description: "50% more iron (upgradable 3 times up to 200% more iron)",
      upgradeable: true,
      maxUpgrade: 3,
      image: "/path/to/iron_pickaxe.png",
      price: 400,
    },
    {
      name: "Regenerative Rave Band",
      description:
        "0.1 health per second (upgradeable 3 times up to 0.4 health per second)",
      upgradeable: true,
      maxUpgrade: 3,
      image: "/path/to/regenerative_rave_band.png",
      price: 400,
    },
  ]);

  const buyItem = (item: any) => {
    // Implement the logic for buying the item
    console.log(`Buying ${item.name}`);
  };

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
      });
      gameState.socket.on("notEnoughResources", (resource:any) => {
        alert("You do not have enough " + resource + " to sell.");
      });
    }
  }, [gameState.socket]);

  const handleAction = (action: string) => {
    gameState.socket.emit("action", action, gameState.user);
  };

  const handleSell = (material: string) => {
    if(parseInt(sellAmount) <= 0) {
      console.log("Invalid amount");
      return;
    } else {
      gameState.socket.emit("sell", material, parseInt(sellAmount), gameState.user);
    }
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
                            <img
                              className="w-4 h-4 rounded-full mr-2"
                              src={getResourceImage(resource)}
                              alt={resource}
                            />
                            <p>{`${value}`}</p>
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
              min="1"
              placeholder="amount"
              value={sellAmount}
              onChange={(e) => {
                setSellAmount(e.target.value);
              }}
            />

            <select
              onChange={(e) => setSellResource(e.target.value)}
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
            <button
              onClick={() => handleSell(sellResource)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            ><p>Sell</p></button>
          </div>
        </div>
        {/* My stats UI */}
        {yourPlayer && (
          <div className={"mb-4 p-2 bg-gray-500 rounded-md shadow-md"}>
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
                <div className="flex flex-wrap">
                  {Object.entries(yourPlayer.resources).map(
                    ([resource, value]) => (
                      <div
                        key={resource}
                        className="flex items-center mr-4 mb-2 text-white"
                      >
                        <img
                          className="w-10 h-4=10 rounded-full mr-2"
                          src={getResourceImage(resource)}
                          alt={resource}
                        />
                        {resource === "hunger" && (
                          <p className="text-xl">{`${value.toFixed(2)}`}</p>
                        )}
                        {resource !== "hunger" && (
                          <p className="text-xl">{`${value}`}</p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Buildings UI */}
        {/* ITEMS Shop UI - can buy various roguelike weapons (5 to start in a flex horizontal scroll shop image placehold on top and buy button underneath
          
          items include:
          Vampiric Scepter - lifesteal 10% of damage dealt
          Infinity Edge - 20% crit chance
          Farmers Hat - 50% more wheat (upgradable 3 times up to 200% more wheat)
          Miners Pickaxe - 50% more stone (upgradable 3 times up to 200% more wheat)
          Woodcutters Axe - 50% more wood (upgradable 3 times up to 200% more wheat)
          Iron Pickaxe - 50% more iron (upgradable 3 times up to 200% more wheat)
          Regenerative Rave Band - 0.1 health per second (upgradeable 3 times up to 0.4 health per second)

          
          */}
      </div>
      {/* <div className="flex p-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-full mb-2"
            />
            <p className="text-center font-semibold mb-2">{item.name}</p>
            <p className="text-xs mb-2">{item.description}</p>
            <p className="text-sm font-bold mb-2">${item.price}</p>
            {item.upgradeable && (
              <p className="text-xs mb-2">
                Upgradeable ({item.maxUpgrade} times)
              </p>
            )}
            <button
              onClick={() => buyItem(item)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Buy
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Game;
