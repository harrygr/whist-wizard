import React from "react";
import { Player, playerReducer } from "../PlayerState";
import { AddPlayerForm } from "./AddPlayerForm";
import { PlayerList } from "./PlayerList";
import { NonEmptyArray, isNonEmptyArray } from "effect/Array";

interface Props {
  startGame: (players: NonEmptyArray<Player>) => void;
}

export const PlayerSetup = ({ startGame }: Props) => {
  const [players, dispatch] = React.useReducer(playerReducer, []);

  return (
    <div>
      <AddPlayerForm
        onAddPlayer={(player) => dispatch({ type: "addPlayer", player })}
      />
      <PlayerList
        players={players}
        removePlayer={(id) => dispatch({ type: "removePlayer", id })}
      />

      <button
        type="button"
        onClick={() => {
          if (isNonEmptyArray(players)) {
            startGame(players);
          }
        }}
      >
        Start Game
      </button>
    </div>
  );
};
