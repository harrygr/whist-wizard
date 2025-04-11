import { describe, expect, it } from "vitest";
import { State, tricksInRound, gameReducer, Action } from "./GameState";

describe("tricksInRound", () => {
  describe("with a 13-round game", () => {
    it("returns the correct number of tricks for the first round", () => {
      expect(tricksInRound(13, 1)).toBe(7);
    });
    it("returns the correct number of tricks for the second round", () => {
      expect(tricksInRound(13, 2)).toBe(6);
    });
    it("returns the correct number of tricks for the seventh round", () => {
      expect(tricksInRound(13, 7)).toBe(1);
    });
    it("returns the correct number of tricks for the last round", () => {
      expect(tricksInRound(13, 13)).toBe(7);
    });
  });
  describe("with a 10-round game", () => {
    it("returns the correct number of tricks for the first round", () => {
      expect(tricksInRound(10, 1)).toBe(6);
    });
    it("returns the correct number of tricks for the fifth round", () => {
      expect(tricksInRound(10, 6)).toBe(1);
    });
    it("returns the correct number of tricks for the last round", () => {
      expect(tricksInRound(10, 10)).toBe(5);
    });
  });
});

describe("Game reducer", () => {
  it("sets the bids for a round", () => {
    const state: State = {
      players: [
        { id: "1", name: "Player 1" },
        { id: "2", name: "Player 2" },
        { id: "3", name: "Player 3" },
      ],
      rounds: [
        { number: 1, dealer: "1", score: null },
        { number: 2, dealer: "2", score: null },
        { number: 3, dealer: "3", score: null },
      ],
      bonus: 10,
    };

    const action: Action = {
      type: "setBids",
      round: 1,
      bids: [5, 4, 3],
    };
    const newState = gameReducer(state, action);

    expect(newState.rounds[0].score).toEqual([
      { id: expect.any(String), bid: 5, won: null },
      { id: expect.any(String), bid: 4, won: null },
      { id: expect.any(String), bid: 3, won: null },
    ]);
  });

  it("sets the tricks for a round", () => {
    const state: State = {
      players: [
        { id: "1", name: "Player 1" },
        { id: "2", name: "Player 2" },
        { id: "3", name: "Player 3" },
      ],
      rounds: [
        {
          number: 1,
          dealer: "1",
          score: [
            { id: "1", bid: 5, won: 5 },
            { id: "2", bid: 4, won: 4 },
            { id: "3", bid: 3, won: 3 },
          ],
        },
        {
          number: 2,
          dealer: "2",
          score: [
            { id: "1", bid: 5, won: null },
            { id: "2", bid: 4, won: null },
            { id: "3", bid: 3, won: null },
          ],
        },
        { number: 3, dealer: "3", score: null },
      ],
      bonus: 10,
    };

    const action: Action = {
      type: "setTricks",
      round: 2,
      tricks: [5, 4, 3],
    };

    const newState = gameReducer(state, action);
    expect(newState.rounds[1].score).toEqual([
      { id: "1", bid: 5, won: 5 },
      { id: "2", bid: 4, won: 4 },
      { id: "3", bid: 3, won: 3 },
    ]);
  });
});
