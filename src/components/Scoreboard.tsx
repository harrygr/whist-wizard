import classNames from "classnames";
import { tricksInRound, State, TOTAL_ROUNDS } from "../GameState";
import React from "react";
import { calculateScores } from "../scoring";

interface Props {
  state: State;
  currentRound: number;
}

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
