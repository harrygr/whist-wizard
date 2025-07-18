import { State } from "../GameState";
import { calculateScores } from "../scoring";
import { Array, pipe, Option, Schema, Either, Order } from "effect";
import { Button } from "./Button";
import classNames from "classnames";

interface Props {
  state: State;
  newGame: () => void;
  hideResult: () => void;
}

const FinalScoresSchema = Schema.NonEmptyArray(Schema.Number);

export const GameResult = ({ state, newGame, hideResult }: Props) => {
  const result = calculateScores(state.players, state.rounds);

  const finalScores = pipe(
    result,
    Array.filterMap(([, score]) => Option.fromNullable(score)),
    Array.last,
    Option.map((scores) =>
      scores.map(({ cumulativeScore }) => cumulativeScore)
    ),
    Either.fromOption(() => "no scores"),
    Either.flatMap(Schema.decodeUnknownEither(FinalScoresSchema)),
    Either.map((scores) => Array.zip(state.players, scores)),
    Either.map(Array.sort(Order.mapInput(Order.number, ([, score]) => -score))),
    Either.mapLeft(() => console.error("Invalid scores")),
    Either.getOrThrow
  );

  return (
    <div className="flex flex-col items-center justify-center absolute inset-0 max-w-screen-sm mx-auto space-y-6">
      <h1 className="text-4xl font-bold mb-4">Game Over</h1>
      <h2 className="text-2xl mb-4">Final Scores</h2>
      <ul>
        {finalScores.map(([player, score], i) => {
          return (
            <li
              key={player.id}
              className={classNames(
                "flex justify-between border-t border-stone-200 tabular-nums items-center gap-8",
                { "font-semibold": i === 0 }
              )}
            >
              <div className={"flex items-center"}>
                <div className="w-6">
                  {i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : null}
                </div>
                <div className="p-1">{player.name}</div>
              </div>
              <div className="p-1">{score}</div>
            </li>
          );
        })}
      </ul>

      <Button onClick={newGame} type="button">
        Play Again
      </Button>

      <Button type="button" kind="secondary" size="small" onClick={hideResult}>
        Back to scores
      </Button>
    </div>
  );
};
