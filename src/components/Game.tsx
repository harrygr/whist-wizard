import React from "react";
import { type Action, type State } from "../GameState";
import { Scoreboard } from "./Scoreboard";
import { GameResult } from "./GameResult";
import { Button } from "./Button";
import { BidSubmitterDialog } from "./BidSubmitterDialog";
import { TrickSubmitterDialog } from "./TrickSubmitterDialog";
import { Array, Option, pipe } from "effect";

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const Game = ({ state, dispatch }: Props) => {
  const currentRound = Array.findFirst(
    state.rounds,
    (round) =>
      round.score === null || round.score.every((score) => score.won === null)
  );

  const [showGameResult, setShowGameResult] = React.useState(false);

  React.useEffect(() => {
    if (Option.isNone(currentRound)) {
      setShowGameResult(true);
    }
  }, [currentRound, state.rounds]);

  if (Option.isNone(currentRound) && showGameResult) {
    return (
      <GameResult
        state={state}
        newGame={() => dispatch({ type: "resetGame" })}
        hideResult={() => setShowGameResult(false)}
      />
    );
  }

  const roundStage = pipe(
    currentRound,
    Option.map((r) =>
      r.score?.every((score) => score.bid !== null) ? "play" : "bid"
    )
  );

  const dealer = pipe(
    currentRound,
    Option.flatMap((round) =>
      Array.findFirst(state.players, (p) => p.id === round.dealer)
    )
  );

  return (
    <div>
      <div className="mb-4 flex justify-between gap-4">
        <dl className="bg-stone-50 border border-stone-300 p-4 rounded-lg text-sm grid grid-cols-[auto_1fr] gap-x-6">
          <dd className="font-semibold">Current round</dd>
          <dt className="text-right">
            {pipe(
              currentRound,
              Option.map((r) => r.number),
              Option.getOrElse(() => "-")
            )}
          </dt>

          <dd className="font-semibold">Stage</dd>
          <dt className="text-right">
            {pipe(
              roundStage,
              Option.getOrElse(() => "Game over")
            )}
          </dt>

          <dd className="font-semibold">Dealer</dd>
          <dt className="text-right">
            {pipe(
              dealer,
              Option.map((d) => d.name),
              Option.getOrElse(() => "-")
            )}
          </dt>
        </dl>
        <div>
          <Button
            type="button"
            kind="secondary"
            onClick={() => dispatch({ type: "resetGame" })}
          >
            Exit
          </Button>
        </div>
      </div>

      {pipe(
        Option.all([roundStage, currentRound]),
        Option.filter(([stage]) => stage === "bid"),
        Option.map(([, round]) => (
          <BidSubmitterDialog
            players={state.players}
            submitBids={(bids) =>
              dispatch({ type: "setBids", round: round.number, bids })
            }
            round={round}
            roundCount={state.rounds.length}
            trigger={<Button type="button">Submit Bids</Button>}
          />
        )),
        Option.getOrNull
      )}

      {pipe(
        Option.all([roundStage, currentRound]),
        Option.filter(([stage]) => stage === "play"),
        Option.map(([, round]) => (
          <TrickSubmitterDialog
            players={state.players}
            submitTricks={(tricks) =>
              dispatch({ type: "setTricks", round: round.number, tricks })
            }
            round={round}
            roundCount={state.rounds.length}
            trigger={<Button type="button">Submit Tricks</Button>}
          />
        )),
        Option.getOrNull
      )}

      <Scoreboard
        state={state}
        dispatch={dispatch}
        currentRound={pipe(
          currentRound,
          Option.map((r) => r.number)
        )}
        roundStage={pipe(
          roundStage,
          Option.getOrElse(() => "results" as const)
        )}
      />
    </div>
  );
};
