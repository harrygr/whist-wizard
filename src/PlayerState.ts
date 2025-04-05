import React from "react";
import { Player } from "./GameState";

type State = Player[];

type Action =
  | { type: "addPlayer"; player: Player }
  | { type: "removePlayer"; id: string };

export const playerReducer: React.Reducer<State, Action> = (state, action) => {
  if (action.type === "addPlayer") {
    return [...state, action.player];
  }
  if (action.type === "removePlayer") {
    return state.filter((player) => player.id !== action.id);
  }

  return state;
};
