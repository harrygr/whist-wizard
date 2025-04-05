import classNames from "classnames";
import {
  tricksInRound,
  State,
  TOTAL_ROUNDS,
  AccumlatedScore,
  PlayerScore,
} from "../GameState";
import { Array, pipe } from "effect";
import React from "react";

interface Props {
  state: State;
  currentRound: number;
}

const calculateScores = (
  players: State["players"],
  rounds: State["rounds"]
) => {
  const scores = pipe(
    rounds.map((round) => {
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

export const Scoreboard = ({ state, currentRound }: Props) => {
  const scores = calculateScores(state.players, state.rounds);

  return (
    <div>
      <h2>Scoreboard</h2>

      <table className="table-fixed w-full border border-stone-200 ">
        <thead className="text-left">
          <tr>
            <th className="p-1"></th>
            {state.players.map((player) => (
              <th
                key={player.id}
                className="border-l border-stone-200 p-1"
                colSpan={4}
              >
                {player.name}
              </th>
            ))}
          </tr>
          <tr>
            <th className="p-1">Round</th>
            {state.players.map((player) => (
              <React.Fragment key={player.id}>
                <th className="p-1 border-l border-stone-200">Bid</th>
                <th className="p-1">Got</th>
                <th className="p-1">Pts</th>
                <th className="p-1">Tot</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="text-left">
          {scores.map(([round, roundScore]) => (
            <tr
              key={round}
              className={classNames("border-t border-stone-200 tabular-nums", {
                "bg-amber-100": round === currentRound,
              })}
            >
              <td className="p-1">
                {round} ({tricksInRound(TOTAL_ROUNDS, round)})
              </td>
              {roundScore
                ? roundScore.map((playerScore) => (
                    <React.Fragment key={playerScore.id}>
                      <td className="border-l border-stone-200 p-1">
                        {playerScore.bid}
                      </td>

                      <td
                        className={classNames(
                          "p-1",
                          playerScore.won === playerScore.bid
                            ? "text-green-700"
                            : "text-red-600"
                        )}
                      >
                        {playerScore.won}
                      </td>
                      <td className="p-1 bg-emerald-100">
                        {playerScore.score}
                      </td>
                      <td className="p-1 bg-emerald-200 font-semibold">
                        {playerScore.cumulativeScore}
                      </td>
                    </React.Fragment>
                  ))
                : state.players.map((player) => (
                    <td
                      colSpan={4}
                      className="border-l border-stone-200 "
                      key={player.id}
                    ></td>
                  ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
