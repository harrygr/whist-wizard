import React from "react";
import { gameReducer } from "./GameState";
import { Game } from "./components/Game";
import { PlayerSetup } from "./components/PlayerSetup";
import { isNonEmptyArray } from "effect/Array";

export const App = () => {
  const [state, dispatch] = React.useReducer(gameReducer, {
    players: [],
    rounds: [],
  });

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-screen-sm mx-auto my-6">
        <h1 className="font-semibold text-2xl">Contract Whist</h1>
      </div>

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
