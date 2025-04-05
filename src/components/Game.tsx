import React from "react";
import { type Action, type State } from "../GameState";
import { Scoreboard } from "./Scoreboard";
import { BidSubmitter } from "./BidSubmitter";
import { TrickSubmitter } from "./TrickSubmitter";

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
    return <p>Game over</p>;
  }

  const roundStage = currentRound.score?.every((score) => score.bid !== null)
    ? "play"
    : "bid";
  return (
    <div>
      <p>Current round: {currentRound.number}</p>
      <p>Stage: {roundStage}</p>
      <hr />
      {roundStage === "bid" && (
        <BidSubmitter
          players={state.players}
          submitBids={(bids) =>
            dispatch({ type: "setBids", round: currentRound.number, bids })
          }
          round={currentRound}
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
        />
      )}
      <hr />
      <Scoreboard state={state} currentRound={currentRound.number} />
    </div>
  );
};
