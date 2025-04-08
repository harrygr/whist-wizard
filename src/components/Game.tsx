import React from "react";
import { type Action, type State } from "../GameState";
import { Scoreboard } from "./Scoreboard";
import { GameResult } from "./GameResult";
import { Button } from "./Button";
import { BidSubmitterDialog } from "./BidSubmitterDialog";
import { TrickSubmitterDialog } from "./TrickSubmitterDialog";

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const Game = ({ state, dispatch }: Props) => {
  const currentRound = state.rounds.find(
    (round) =>
      round.score === null || round.score.every((score) => score.won === null)
  );

  if (!currentRound) {
    return (
      <GameResult
        state={state}
        newGame={() => dispatch({ type: "resetGame" })}
      />
    );
  }

  const roundStage = currentRound.score?.every((score) => score.bid !== null)
    ? "play"
    : "bid";

  return (
    <div>
      <div className="mb-4 flex justify-between gap-4">
        <dl className="bg-stone-50 border border-stone-300 p-4 rounded-lg text-sm grid grid-cols-2 gap-x-2">
          <dd className="font-semibold">Current round</dd>
          <dt className="text-right">{currentRound.number}</dt>

          <dd className="font-semibold">Stage</dd>
          <dt className="text-right">{roundStage}</dt>

          <dd className="font-semibold">Dealer</dd>
          <dt className="text-right">
            {state.players.find((p) => p.id === currentRound.dealer)?.name}
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

      {roundStage === "bid" && (
        <BidSubmitterDialog
          players={state.players}
          submitBids={(bids) =>
            dispatch({ type: "setBids", round: currentRound.number, bids })
          }
          round={currentRound}
          roundCount={state.rounds.length}
        />
      )}
      {roundStage === "play" && (
        <TrickSubmitterDialog
          players={state.players}
          submitTricks={(tricks) =>
            dispatch({
              type: "setTricks",
              round: currentRound.number,
              tricks,
            })
          }
          round={currentRound}
          roundCount={state.rounds.length}
        />
      )}

      <Scoreboard
        state={state}
        currentRound={currentRound.number}
        roundStage={roundStage}
      />
    </div>
  );
};
