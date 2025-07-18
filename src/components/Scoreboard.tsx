import { Action, State } from "../GameState";
import React from "react";
import { calculateScores } from "../scoring";
import { Accordion } from "radix-ui";
import classNames from "classnames";
import { tricksInRound } from "../util/tricksInRound";
import { BidSubmitterDialog } from "./BidSubmitterDialog";
import { Button } from "./Button";
import { TrickSubmitterDialog } from "./TrickSubmitterDialog";
import { isNil } from "../util/isNil";
import { Option, pipe } from "effect";

interface Props {
  state: State;
  currentRound: Option.Option<number>;
  roundStage: "bid" | "play" | "results";

  dispatch: React.Dispatch<Action>;
}

export const Scoreboard = ({
  state,
  currentRound,
  roundStage,
  dispatch,
}: Props) => {
  const scores = calculateScores(state.players, state.rounds);

  const currentRoundNumber = pipe(
    currentRound,
    Option.getOrElse(() => 1)
  );
  console.log("Current round number:", currentRoundNumber);
  const [roundIndex, setRoundIndex] = React.useState(`${currentRoundNumber}`);
  React.useEffect(() => {
    if (roundStage === "play") {
      setRoundIndex(`${currentRoundNumber}`);
    } else {
      // If the round stage is "bid", we want to show the previous round
      setRoundIndex(`${currentRoundNumber - 1}`);
    }
  }, [roundStage, currentRoundNumber]);

  return (
    <div className="overflow-x-auto overflow-hidden text-sm">
      <div className="grid grid-flow-col auto-cols-fr gap-2 p-2">
        <div></div>
        {state.players.map((player) => (
          <div key={player.id} className="text-right">
            {player.id === state.rounds[currentRoundNumber - 1]?.dealer ? (
              <span className="mr-0.5" title="Dealer">
                🃏
              </span>
            ) : null}{" "}
            {player.name}
          </div>
        ))}
      </div>

      <Accordion.Root
        type="single"
        collapsible
        className="space-y-2"
        value={roundIndex}
        onValueChange={(v) => setRoundIndex(v)}
      >
        {scores.map(([round, scores]) => {
          return (
            <Accordion.Item
              className="border border-stone-300 rounded-md data-[state=open]:shadow-sm"
              value={`${round}`}
              key={round}
            >
              <Accordion.Trigger className="group grid grid-flow-col auto-cols-fr gap-2 w-full text-left cursor-pointer p-2">
                <div>
                  R{round}{" "}
                  <span className="text-stone-400">
                    ({tricksInRound(state.rounds.length, round)})
                  </span>
                </div>
                {scores?.map((score) => {
                  return (
                    <div
                      key={score.id}
                      className="font-bold font-mono text-right tabular-nums"
                    >
                      {score.cumulativeScore}
                    </div>
                  );
                })}
              </Accordion.Trigger>

              <Accordion.Content className="p-2 overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down [data-state=closed]>">
                <div className="mb-2 flex gap-2">
                  {!!scores && (
                    <BidSubmitterDialog
                      players={state.players}
                      submitBids={(bids) =>
                        dispatch({ type: "setBids", round, bids })
                      }
                      round={state.rounds.find((r) => r.number === round)!}
                      roundCount={state.rounds.length}
                      existingBids={scores.map((score) => score.bid)}
                      trigger={
                        <Button type="button" kind="secondary" size="small">
                          Edit Bids
                        </Button>
                      }
                    />
                  )}

                  {!!scores && scores.every((score) => !isNil(score.won)) && (
                    <TrickSubmitterDialog
                      players={state.players}
                      submitTricks={(tricks) =>
                        dispatch({ type: "setTricks", round, tricks })
                      }
                      round={state.rounds.find((r) => r.number === round)!}
                      roundCount={state.rounds.length}
                      existingTricks={scores.map((score) => score.won)}
                      trigger={
                        <Button type="button" kind="secondary" size="small">
                          Edit Tricks
                        </Button>
                      }
                    />
                  )}
                </div>
                <div className="grid grid-flow-col auto-cols-fr gap-2">
                  <div className="text-stone-400">
                    <div className="py-1">Bid</div>
                    <div className="py-1">Got</div>
                    <div className="py-1">Pts</div>
                  </div>

                  {scores ? (
                    scores.map((score) => {
                      return (
                        <div
                          className="tabular-nums font-mono text-right"
                          key={score.id}
                        >
                          <div className="py-1 text-stone-500">{score.bid}</div>
                          <div
                            className={classNames(
                              "py-1",
                              score.won === score.bid
                                ? "text-green-700"
                                : "text-red-700"
                            )}
                          >
                            {score.won}
                          </div>
                          <div className="py-1">{score.score}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div></div>
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
};
