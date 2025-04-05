import { useForm } from "react-hook-form";
import { Player, Round, tricksInRound } from "../GameState";
import React from "react";
import { Option, pipe, Record, Array } from "effect";
import { NumberButton } from "./NumberButton";
import { Button } from "./Button";
import { SubmissionSummary } from "./SubmissionSummary";

interface Props {
  players: readonly Player[];
  submitBids: (bids: number[]) => void;
  round: Round;
  roundCount: number;
}

export const BidSubmitter = ({
  players,
  submitBids,
  round,
  roundCount,
}: Props) => {
  const dealerOffset = pipe(
    Option.fromNullable(
      players.findIndex((player) => player.id === round.dealer)
    ),
    Option.filter((index) => index >= 0),
    Option.map((index) => (index - 1 + players.length) % players.length),
    Option.getOrElse(() => 0)
  );

  const totalTricks = tricksInRound(roundCount, round.number);
  const { handleSubmit, setValue, getValues, clearErrors, watch } = useForm<{
    bids: Record<string, number>;
  }>({
    defaultValues: { bids: {} },
  });
  const currentBids = watch("bids");
  const bidsSubmitted = Object.values(currentBids).length;

  const [playerIndex, setPlayerId] = React.useState(dealerOffset);
  const readyToSubmit = bidsSubmitted === players.length;

  const currentPlayer = players[playerIndex];

  const isLastToBid = bidsSubmitted === players.length - 1;
  const totalBid = Object.values(currentBids).reduce(
    (acc, bid) => acc + bid,
    0
  );

  const submitPlayerBid = (playerId: string, bid: number) => {
    if (readyToSubmit) {
      return;
    }

    setValue(`bids.${playerId}`, bid);
    setPlayerId((playerIndex + 1) % players.length);
  };

  return (
    <form
      className="max-w-sm mx-auto"
      onSubmit={handleSubmit((values) => {
        const bids = players.map((player) => values.bids[player.id]);
        return submitBids(bids);
      })}
    >
      <h2 className="text-2xl font-semibold mb-2">Player Bids</h2>
      <p className="text-stone-500 mb-4">
        Round {round.number} • {totalTricks} cards
      </p>

      {readyToSubmit ? null : (
        <div>
          <h3 className="text-xl mb-4">{currentPlayer.name}</h3>
          <div className="grid gap-4 grid-cols-4">
            {Array.makeBy(totalTricks + 1, (bidValue) => {
              const isDisabled = isLastToBid
                ? totalTricks - totalBid === bidValue
                : false;

              return (
                <NumberButton
                  key={bidValue}
                  onClick={() => submitPlayerBid(currentPlayer.id, bidValue)}
                  disabled={isDisabled}
                  type="button"
                >
                  {bidValue}
                </NumberButton>
              );
            })}
          </div>

          {!Record.isEmptyRecord(currentBids) ? (
            <div className="mt-4 flex justify-end">
              <Button
                kind="secondary"
                size="small"
                onClick={() => {
                  const previousPlayerId =
                    players[(playerIndex - 1 + players.length) % players.length]
                      .id;
                  clearErrors("bids");
                  setValue(
                    "bids",
                    Record.remove(getValues("bids"), previousPlayerId)
                  );
                  setPlayerId(
                    (playerIndex - 1 + players.length) % players.length
                  );
                }}
                type="button"
              >
                Undo last
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <SubmissionSummary
        type="bid"
        totalTricks={totalTricks}
        currentSubmissions={Array.filterMap(players, (player) =>
          pipe(
            Option.fromNullable(currentBids[player.id]),
            Option.map((trick) => [player, trick])
          )
        )}
      />

      {readyToSubmit ? (
        <div className="mb-4">
          <button
            type="submit"
            className="px-6 py-2 border rounded bg-fuchsia-300 border-fuchsia-400 text-fushia-500 cursor-pointer"
          >
            Play
          </button>
        </div>
      ) : null}
    </form>
  );
};
