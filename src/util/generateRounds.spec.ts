import { describe, expect, it } from "vitest";
import { generateRounds } from "./generateRounds";

describe("generateRounds", () => {
  it("generates rounds for 3 players", () => {
    const players = [
      { id: "p1", name: "Player 1" },
      { id: "p2", name: "Player 2" },
      { id: "p3", name: "Player 3" },
    ];
    const result = generateRounds(players, 3);
    expect(result).toMatchInlineSnapshot(`
      [
        {
          "dealer": "p1",
          "number": 1,
          "score": null,
        },
        {
          "dealer": "p2",
          "number": 2,
          "score": null,
        },
        {
          "dealer": "p3",
          "number": 3,
          "score": null,
        },
      ]
    `);
  });
});
