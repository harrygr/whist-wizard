import { useForm } from "react-hook-form";
import { Player, Round } from "../GameState";
import React from "react";
import { Option, pipe, Record, Array } from "effect";
import { NumberButton } from "./NumberButton";
import { Button } from "./Button";
import { SubmissionSummary } from "./SubmissionSummary";
import { tricksInRound } from "../util/tricksInRound";

interface Props {
  players: readonly Player[];
  submitBids: (bids: number[]) => void;
  round: Round;
  roundCount: number;
  existingBids?: number[];
  onSubmitComplete?: () => void;
}

export const BidSubmitter = ({
  players,
  submitBids,
  round,
  roundCount,
  existingBids,
  onSubmitComplete,
}: Props) => {
  const dealerOffset = pipe(
    players,
    Array.findFirstIndex((player) => player.id === round.dealer),
    Option.filter((index) => index >= 0),
    Option.map((index) => (index + 1 + players.length) % players.length),
    Option.getOrElse(() => 0)
  );

  const totalTricks = tricksInRound(roundCount, round.number);

  // Initialize with existing bids if provided
  const initialBids = existingBids
    ? players.reduce((acc, player, index) => {
        acc[player.id] = existingBids[index];
        return acc;
      }, {} as Record<string, number>)
    : {};

  const { handleSubmit, setValue, getValues, clearErrors, watch } = useForm<{
    bids: Record<string, number>;
  }>({ defaultValues: { bids: initialBids } });

  const currentBids = watch("bids");
  const bidsSubmitted = Object.values(currentBids).length;

  const [playerIndex, setPlayerId] = React.useState(
    existingBids ? players.length : dealerOffset
  );
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
      onSubmit={handleSubmit((values) => {
        const bids = players.map((player) => values.bids[player.id]);
        submitBids(bids);
        onSubmitComplete?.();
      })}
    >
      <p className="text-stone-500 mb-4">
        Round {round.number} • {totalTricks} cards
      </p>

      {readyToSubmit ? null : (
        <div>
          <h3 className="text-xl mb-4 inline-block bg-fuchsia-400/40 rounded-lg px-4 text-fuchsia-800 py-1">
            {currentPlayer.name}
          </h3>
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
        </div>
      )}

      {!Record.isEmptyRecord(currentBids) ? (
        <div className="mt-4 flex justify-end">
          <Button
            kind="secondary"
            size="small"
            onClick={() => {
              const previousPlayerId =
                players[(playerIndex - 1 + players.length) % players.length].id;
              clearErrors("bids");
              setValue(
                "bids",
                Record.remove(getValues("bids"), previousPlayerId)
              );
              setPlayerId((playerIndex - 1 + players.length) % players.length);
            }}
            type="button"
          >
            Undo last
          </Button>
        </div>
      ) : null}

      <SubmissionSummary
        type="bid"
        totalTricks={totalTricks}
        currentSubmissions={Array.map(
          players,
          (player) => [player, currentBids[player.id]] as const
        )}
      />

      {readyToSubmit ? (
        <div className="mb-4">
          <Button type="submit">Play</Button>
        </div>
      ) : null}
    </form>
  );
};
