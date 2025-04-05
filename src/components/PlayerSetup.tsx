import React from "react";
import { AddPlayerForm } from "./AddPlayerForm";
import { NonEmptyArray, isNonEmptyArray } from "effect/Array";
import { Player } from "../GameState";
import { Button } from "./Button";
import { PlayerList } from "./PlayerList";
import { Either, pipe, Schema } from "effect";

const ROUNDS_IN_GAME = 13;

interface Props {
  startGame: (players: NonEmptyArray<Player>, roundCount: number) => void;
}

const PlayerSchema = Schema.NonEmptyArray(
  Schema.Struct({
    id: Schema.String,
    name: Schema.String,
  })
);

interface State {
  players: Player[];
  error: string | null;
}

type Action =
  | { type: "setPlayers"; players: Player[] }
  | { type: "setError"; error: string | null }
  | { type: "addPlayer"; player: Player }
  | { type: "removePlayer"; id: string };

const reducer: React.Reducer<State, Action> = (state, action) => {
  if (action.type === "setPlayers") {
    return { error: null, players: action.players };
  }
  if (action.type === "setError") {
    return { ...state, error: action.error };
  }
  if (action.type === "addPlayer") {
    return { error: null, players: [...state.players, action.player] };
  }
  if (action.type === "removePlayer") {
    return {
      ...state,
      players: state.players.filter((player) => player.id !== action.id),
    };
  }
  return state;
};

export const PlayerSetup = ({ startGame }: Props) => {
  const [state, dispatch] = React.useReducer(
    reducer,
    { players: [], error: null },
    (init: State): State =>
      pipe(
        localStorage.getItem("players") ?? "{}",
        Schema.decodeUnknownEither(Schema.parseJson(PlayerSchema)),
        Either.map((players) => ({
          players: Array.from(players),
          error: null,
        })),
        Either.getOrElse(() => init)
      )
  );

  return (
    <div className="max-w-screen-sm mx-auto space-y-4">
      <h1 className="text-2xl">New Game</h1>

      <AddPlayerForm
        onAddPlayer={(player) => dispatch({ type: "addPlayer", player })}
      />

      <PlayerList
        players={state.players}
        setPlayers={(players) => dispatch({ type: "setPlayers", players })}
        removePlayer={(id) => dispatch({ type: "removePlayer", id })}
      />
      {state.error && (
        <div className="text-red-500 text-sm my-2">{state.error}</div>
      )}
      <Button
        type="button"
        onClick={() => {
          if (state.players.length < 2) {
            dispatch({ type: "setError", error: "Add at least 2 players" });

            return;
          }
          if (isNonEmptyArray(state.players)) {
            localStorage.setItem("players", JSON.stringify(state.players));

            startGame(state.players, ROUNDS_IN_GAME);
          }
        }}
      >
        Start Game
      </Button>
    </div>
  );
};
