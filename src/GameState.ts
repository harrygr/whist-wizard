import { Array, Option, pipe, Schema } from "effect";
import { nanoid } from "nanoid";
import React from "react";

export const DEFAULT_BONUS = 10;
export const DEFAULT_ROUNDS_IN_GAME = 13;

const generateRounds = (players: Player[], roundCount: number): Round[] => {
  const rounds = Array.makeBy(roundCount, (i): Round => {
    const dealer = players[i % players.length].id;
    return {
      number: i + 1,
      dealer,
      score: null,
    };
  });

  return rounds;
};

const Player = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
});

export type Player = typeof Player.Type;

const PlayerRoundResult = Schema.Struct({
  id: Schema.String,
  bid: Schema.Number,
  won: Schema.Union(Schema.Null, Schema.Number),
});

export type PlayerRoundResult = typeof PlayerRoundResult.Type;

const Round = Schema.Struct({
  number: Schema.Number,
  dealer: Schema.String,
  score: Schema.Union(Schema.Null, Schema.Array(PlayerRoundResult)),
});
export type Round = typeof Round.Type;

export const State = Schema.Struct({
  players: Schema.Array(Player),
  rounds: Schema.Array(Round),
  bonus: Schema.Number.pipe(Schema.int()),
});
export type State = typeof State.Type;

export type GameStateConfig = {
  players: Player[];
  roundCount: number;
  bonus: number;
};

export type Action =
  | ({ type: "startGame" } & GameStateConfig)
  | { type: "setBids"; round: number; bids: number[] }
  | { type: "setTricks"; round: number; tricks: number[] }
  | { type: "resumeGame"; state: State }
  | { type: "resetGame" };

export const gameReducer: React.Reducer<State, Action> = (state, action) => {
  if (action.type === "resumeGame") {
    return action.state;
  }
  if (action.type === "resetGame") {
    return { players: [], rounds: [], bonus: DEFAULT_BONUS };
  }
  if (action.type === "startGame") {
    return {
      ...state,
      players: action.players,
      rounds: generateRounds(action.players, action.roundCount),
      bonus: action.bonus,
    };
  }
  if (action.type === "setBids") {
    if (action.bids.length !== state.players.length) {
      throw new Error("Invalid number of bids");
    }

    const rounds = state.rounds.map((round) => {
      if (round.number === action.round) {
        return {
          ...round,
          score: action.bids.map((bid) => ({
            id: nanoid(5),
            bid: bid,
            won: null,
          })),
        };
      }
      return round;
    });

    return { ...state, rounds };
  }

  if (action.type === "setTricks") {
    if (action.tricks.length !== state.players.length) {
      throw new Error("Invalid number of tricks");
    }
    const rounds = state.rounds.map((round) => {
      if (round.number === action.round) {
        const score = pipe(
          Option.fromNullable(round.score),
          Option.map((s) => Array.zip(s, action.tricks)),
          Option.map((zipped) =>
            zipped.map(
              ([s, tricks]): PlayerRoundResult => ({ ...s, won: tricks })
            )
          ),
          Option.getOrElse(() => round.score)
        );

        return { ...round, score };
      }
      return round;
    });

    return { ...state, rounds };
  }

  return state;
};

export const tricksInRound = (totalRounds: number, round: number): number => {
  if (round > totalRounds) {
    throw new Error(
      `Invalid round number "${round}" for ${totalRounds} rounds`
    );
  }
  const halfRounds = Math.ceil((totalRounds + 1) / 2);

  return round <= halfRounds ? halfRounds - round + 1 : round - halfRounds + 1;
};
