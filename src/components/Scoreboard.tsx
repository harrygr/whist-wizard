import { State, tricksInRound } from "../GameState";
import React from "react";
import { calculateScores } from "../scoring";
import { Accordion } from "radix-ui";
import classNames from "classnames";

interface Props {
  state: State;
  currentRound: number;
  roundStage: "bid" | "play";
}

export const Scoreboard = ({ state, currentRound, roundStage }: Props) => {
  const scores = calculateScores(state.players, state.rounds);

  const [roundIndex, setAccValue] = React.useState(currentRound);

  React.useEffect(() => {
    if (roundStage === "play") {
      setAccValue(currentRound);
    } else {
      setAccValue(currentRound);
    }
  }, [roundStage, currentRound]);

  return (
    <div className="overflow-x-auto overflow-hidden text-sm">
      <div className="grid grid-flow-col auto-cols-fr gap-2 p-2">
        <div></div>
        {state.players.map((player) => (
          <div key={player.id} className="text-right">
            {player.id === state.rounds[currentRound - 1]?.dealer ? (
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
        value={`${roundIndex}`}
        onValueChange={(v) => setAccValue(parseInt(v, 10))}
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

              <Accordion.Content className="p-2 grid grid-flow-col auto-cols-fr gap-2 overflow-hidden data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down [data-state=closed]>">
                <div className="">
                  <div className=""></div>

                  <div className="text-stone-400">
                    <div className="py-1">Bid</div>
                    <div className="py-1">Got</div>
                    <div className="py-1">Pts</div>
                  </div>
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
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </div>
  );
};
