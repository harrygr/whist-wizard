import { describe, expect, it } from "vitest";
import { calculateScores } from "./scoring";

describe("calculateScores", () => {
  it("calculates scores for the end of the game", () => {
    const players = [
      { id: "1", name: "Player 1" },
      { id: "2", name: "Player 2" },
      { id: "3", name: "Player 3" },
    ];

    const rounds = [
      {
        number: 1,
        dealer: "1",
        score: [
          { id: "1", bid: 1, won: 1 },
          { id: "2", bid: 0, won: 0 },
          { id: "3", bid: 0, won: 1 },
        ],
      },
      {
        number: 2,
        dealer: "2",
        score: [
          { id: "1", bid: 0, won: 1 },
          { id: "2", bid: 1, won: 0 },
          { id: "3", bid: 1, won: 0 },
        ],
      },
    ];
    const result = calculateScores(players, rounds);

    const finalRoundResult = result[1][1];

    expect(finalRoundResult).toEqual([
      { id: "1", bid: 0, won: 1, score: 1, cumulativeScore: 12 },
      { id: "2", bid: 1, won: 0, score: 0, cumulativeScore: 10 },
      { id: "3", bid: 1, won: 0, score: 0, cumulativeScore: 1 },
    ]);
  });
});
