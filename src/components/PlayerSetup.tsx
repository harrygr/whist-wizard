import React from "react";
import { playerReducer } from "../PlayerState";
import { AddPlayerForm } from "./AddPlayerForm";
import { PlayerList } from "./PlayerList";
import { NonEmptyArray, isNonEmptyArray } from "effect/Array";
import { Player } from "../GameState";
import { Button } from "./Button";

interface Props {
  startGame: (players: NonEmptyArray<Player>) => void;
}

export const PlayerSetup = ({ startGame }: Props) => {
  const [players, dispatch] = React.useReducer(playerReducer, []);

  return (
    <div className="max-w-screen-sm mx-auto space-y-4">
      <AddPlayerForm
        onAddPlayer={(player) => dispatch({ type: "addPlayer", player })}
      />
      <PlayerList
        players={players}
        removePlayer={(id) => dispatch({ type: "removePlayer", id })}
      />

      <Button
        type="button"
        onClick={() => {
          if (isNonEmptyArray(players)) {
            startGame(players);
          }
        }}
      >
        Start Game
      </Button>
    </div>
  );
};
