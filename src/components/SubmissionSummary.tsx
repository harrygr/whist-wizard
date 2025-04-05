import classNames from "classnames";
import { Player } from "../GameState";

interface Props {
  totalTricks: number;
  currentSubmissions: Array<[Player, number]>;
  type: "bid" | "trick";
}

export const SubmissionSummary = ({
  currentSubmissions,
  totalTricks,
  type,
}: Props) => {
  return (
    <div
      className={classNames("mt-4", {
        "border-t border-stone-300 pt-4": currentSubmissions.length > 0,
      })}
    >
      {currentSubmissions.map(([player, amount]) => (
        <div key={player.id} className="flex justify-between">
          <span>{player.name}</span>
          <span className="tabular-nums">{amount}</span>
        </div>
      ))}
      <div className="flex justify-between pt-4 border-t border-stone-300 mt-4 pb-6">
        <span>Total {type}s</span>
        <span className="tabular-nums">
          {currentSubmissions.reduce((acc, [, n]) => n + acc, 0)} /{" "}
          {totalTricks}
        </span>
      </div>
    </div>
  );
};
