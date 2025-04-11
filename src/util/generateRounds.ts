import { Array } from "effect";
import type { Player, Round } from "../GameState";

export const generateRounds = (
  players: Player[],
  roundCount: number
): Round[] => {
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
