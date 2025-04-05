import { State } from "../GameState";
import { calculateScores } from "../scoring";
import { Array, pipe, Option, Schema, Effect, Order } from "effect";
import { Button } from "./Button";

interface Props {
  state: State;
  newGame: () => void;
}

const FinalScoresSchema = Schema.NonEmptyArray(Schema.Number);

export const GameResult = ({ state, newGame }: Props) => {
  const result = calculateScores(state.players, state.rounds);

  const finalScores = pipe(
    result,
    Array.filterMap(([, score]) => Option.fromNullable(score)),
    Array.last,
    Effect.map((scores) =>
      scores.map(({ cumulativeScore }) => cumulativeScore)
    ),
    Effect.flatMap(Schema.decodeUnknown(FinalScoresSchema)),
    Effect.map((scores) => Array.zip(state.players, scores)),
    Effect.map(Array.sort(Order.mapInput(Order.number, ([, score]) => -score))),
    Effect.runSync
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-screen-sm mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      <h2 className="text-2xl mb-4">Final Scores</h2>
      <table className="table-fixed w-full border border-stone-200">
        <thead className="text-left">
          <tr>
            <th className="p-1">Player</th>
            <th className="p-1">Total Score</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {finalScores.map(([player, score]) => {
            return (
              <tr
                key={player.id}
                className="border-t border-stone-200 tabular-nums"
              >
                <td className="p-1">{player.name}</td>
                <td className="p-1">{score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Button onClick={newGame} type="button">
        Play Again
      </Button>
    </div>
  );
};
