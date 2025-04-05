import React, { useEffect } from "react";
import { gameReducer } from "./GameState";
import { Game } from "./components/Game";
import { PlayerSetup } from "./components/PlayerSetup";
import { isNonEmptyArray } from "effect/Array";

const initialPlayers = [
  // (1)
  { id: "ali1", name: "Alice" },
  { id: "bob2", name: "Bob" },
  { id: "cha3", name: "Charlie" },
  { id: "dav4", name: "David" },
];

export const App = () => {
  useEffect(() => {
    dispatch({ type: "startGame", players: initialPlayers });
  }, []);
  const [state, dispatch] = React.useReducer(gameReducer, {
    players: [],
    rounds: [],
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-semibold text-2xl">Contract Whist</h1>

      {isNonEmptyArray(state.players) ? (
        <Game state={state} dispatch={dispatch} />
      ) : (
        <PlayerSetup
          startGame={(players) => dispatch({ type: "startGame", players })}
        />
      )}
    </div>
  );
};
