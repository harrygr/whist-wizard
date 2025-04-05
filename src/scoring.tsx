import { pipe, Array } from "effect";
import { PlayerRoundResult, State } from "./GameState";

export interface PlayerScore extends PlayerRoundResult {
  score: number | null;
}

export interface AccumlatedScore extends PlayerScore {
  cumulativeScore: number | null;
}

/**
 * Calculate the scores for each player in each round, including a running total.
 *
 * @param players
 * @param rounds
 * @returns an array of tuples, where each tuple contains the round number and an array of player scores for that round.
 */
export const calculateScores = (
  players: State["players"],
  rounds: State["rounds"]
) => {
  const scores = pipe(
    rounds,
    Array.map((round) => {
      if (!round.score) {
        return null;
      }

      return pipe(
        Array.zip(players, round.score),
        Array.map(
          ([player, score]): PlayerScore => ({
            id: player.id,
            bid: score.bid,
            won: score.won,
            score: score.won === score.bid ? 10 + score.bid : score.won,
          })
        )
      );
    }),
    Array.mapAccum(
      players.map(() => 0),
      (acc: Array<number | null>, roundScores) => {
        if (!roundScores) {
          return [acc, null];
        }
        const roundScoresWithCumulative = pipe(
          Array.zip(acc, roundScores),
          Array.map(
            ([playerTotal, playerScore]): AccumlatedScore => ({
              ...playerScore,
              cumulativeScore:
                playerScore.score !== null
                  ? (playerTotal ?? 0) + playerScore.score
                  : null,
            })
          )
        );

        return [
          roundScoresWithCumulative.map(
            ({ cumulativeScore }) => cumulativeScore
          ),
          roundScoresWithCumulative,
        ];
      }
    ),
    ([, result]) => result
  );

  return pipe(
    rounds,
    Array.map((round) => round.number),
    Array.zip(scores)
  );
};
