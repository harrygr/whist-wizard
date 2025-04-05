import { describe, expect, it } from "vitest";
import { tricksInRound } from "./GameState";

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
