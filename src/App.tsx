import React from "react";
import { gameReducer, State } from "./GameState";
import { Game } from "./components/Game";
import { PlayerSetup } from "./components/GameSetup";
import { Either, pipe, Schema } from "effect";

export const App = () => {
  const [state, dispatch] = React.useReducer(
    gameReducer,
    { players: [], rounds: [], bonus: 10 },
    (init: State) => {
      return pipe(
        localStorage.getItem("currentGame") ?? "{}",
        Schema.decodeUnknownEither(Schema.parseJson(State)),
        Either.getOrElse(() => init)
      );
    }
  );

  React.useEffect(() => {
    try {
      localStorage.setItem("currentGame", JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8">
      {state.players.length > 0 ? (
        <Game state={state} dispatch={dispatch} />
      ) : (
        <div>
          <div className="max-w-screen-sm mx-auto space-y-4">
            <h1 className="text-3xl font-semibold mb-2">WhistWizard</h1>
            <p className="mb-4 text-stone-500">
              Keep score of your game of contract whist.
            </p>
          </div>
          <PlayerSetup
            startGame={(config) => dispatch({ type: "startGame", ...config })}
          />
        </div>
      )}
    </div>
  );
};
