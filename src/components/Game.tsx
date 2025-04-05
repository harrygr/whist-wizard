import React from "react";
import { type Action, type State } from "../GameState";
import { Scoreboard } from "./Scoreboard";
import { BidSubmitter } from "./BidSubmitter";
import { TrickSubmitter } from "./TrickSubmitter";
import { GameResult } from "./GameResult";
import { Button } from "./Button";

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
      <div className="mb-4 max-w-screen-sm mx-auto flex justify-between gap-4">
        <div>
          <p>Current round: {currentRound.number}</p>
          <p>Stage: {roundStage}</p>
        </div>
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
        <BidSubmitter
          players={state.players}
          submitBids={(bids) =>
            dispatch({ type: "setBids", round: currentRound.number, bids })
          }
          round={currentRound}
          roundCount={state.rounds.length}
        />
      )}
      {roundStage === "play" && (
        <TrickSubmitter
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

      <Scoreboard state={state} currentRound={currentRound.number} />
    </div>
  );
};
