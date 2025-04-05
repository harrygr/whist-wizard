import React from "react";
import { gameReducer, State } from "./GameState";
import { Game } from "./components/Game";
import { PlayerSetup } from "./components/PlayerSetup";
import { Either, pipe, Schema } from "effect";

export const App = () => {
  const [state, dispatch] = React.useReducer(
    gameReducer,
    { players: [], rounds: [] },
    (init: State) => {
      return pipe(
        localStorage.getItem("currentGame") ?? "{}",
        Schema.decodeUnknownEither(Schema.parseJson(State)),
        Either.getOrElse(() => init)
      );
    }
  );

  React.useEffect(() => {
    localStorage.setItem("currentGame", JSON.stringify(state));
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8">
      {state.players.length > 0 ? (
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
