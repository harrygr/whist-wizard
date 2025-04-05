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
    <div className="container mx-auto px-4 py-8">
      {isNonEmptyArray(state.players) ? (
        <Game state={state} dispatch={dispatch} />
      ) : (
        <PlayerSetup
          startGame={(players, roundCount) =>
            dispatch({ type: "startGame", players, roundCount })
          }
        />
      )}
    </div>
  );
};
