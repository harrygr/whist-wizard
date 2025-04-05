import { Array, Option, pipe } from "effect";
import { nanoid } from "nanoid";
import React from "react";

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

export interface Player {
  id: string;
  name: string;
}

export interface PlayerRoundResult {
  id: string;
  bid: number;
  won: number | null;
}
export interface PlayerScore extends PlayerRoundResult {
  score: number | null;
}

export interface AccumlatedScore extends PlayerScore {
  cumulativeScore: number | null;
}

export interface Round {
  number: number;
  dealer: string;
  score: PlayerRoundResult[] | null;
}

export interface State {
  players: Player[];
  rounds: Round[];
}

export type Action =
  | { type: "startGame"; players: Player[]; roundCount: number }
  | { type: "setBids"; round: number; bids: number[] }
  | { type: "setTricks"; round: number; tricks: number[] }
  | { type: "resetGame" };

export const gameReducer: React.Reducer<State, Action> = (state, action) => {
  if (action.type === "resetGame") {
    return { players: state.players, rounds: [] };
  }
  if (action.type === "startGame") {
    return {
      ...state,
      players: action.players,
      rounds: generateRounds(action.players, action.roundCount),
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

        return {
          ...round,
          score,
        };
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
