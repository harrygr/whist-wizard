import { useForm, Controller } from "react-hook-form";
import { Player, Round } from "../GameState";
import React from "react";
import { Option, pipe, Array, Record } from "effect";
import { NumberButton } from "./NumberButton";
import { SubmissionSummary } from "./SubmissionSummary";
import { Button } from "./Button";
import { tricksInRound } from "../util/tricksInRound";
import { isNil } from "../util/isNil";

interface Props {
  players: readonly Player[];
  submitTricks: (bids: number[]) => void;
  round: Round;
  roundCount: number;
  existingTricks?: (number | null)[];
  onSubmitComplete?: () => void;
}

export const TrickSubmitter = ({
  players,
  submitTricks,
  round,
  roundCount,
  existingTricks,
  onSubmitComplete,
}: Props) => {
  const dealerOffset = pipe(
    players,
    Array.findFirstIndex((player) => player.id === round.dealer),
    Option.filter((index) => index >= 0),
    Option.map((index) => (index + 1 + players.length) % players.length),
    Option.getOrElse(() => 0)
  );

  const totalTricksInRound = tricksInRound(roundCount, round.number);

  const initialTricks = pipe(
    Array.zip(players, existingTricks ?? []),
    Array.map(([player, tricks]) => [player.id, tricks] as const),
    Array.filter((r): r is [string, number] => !isNil(r[1])),
    Record.fromEntries
  );

  const { handleSubmit, clearErrors, control, trigger, watch } = useForm<{
    tricks: Record<string, number>;
  }>({ defaultValues: { tricks: initialTricks } });

  const currentTricks = watch("tricks");

  const [playerIndex, setPlayerId] = React.useState(dealerOffset);
  const readyToSubmit = Record.size(currentTricks) === players.length;

  const currentPlayer = players[playerIndex];

  React.useEffect(() => {
    if (readyToSubmit) {
      trigger("tricks");
    }
  }, [readyToSubmit, trigger]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const tricks = players.map((player) => values.tricks[player.id]);
        onSubmitComplete?.();
        return submitTricks(tricks);
      })}
    >
      <p className="text-stone-500 mb-4">
        Round {round.number} • {totalTricksInRound} cards
      </p>

      <Controller
        name="tricks"
        control={control}
        rules={{
          validate: (tricks) =>
            pipe(
              tricks,
              Record.reduce(0, (acc, trick) => acc + trick),
              (totalSubmitted) =>
                totalSubmitted === totalTricksInRound
                  ? undefined
                  : `Total tricks must equal the total tricks in the round (${totalTricksInRound})`
            ),
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            {!readyToSubmit ? (
              <>
                <h3 className="text-xl mb-4 inline-block bg-fuchsia-400/40 rounded-lg px-4 text-fuchsia-800 py-1">
                  {currentPlayer.name}
                </h3>

                <div className="grid gap-4 grid-cols-4">
                  {Array.makeBy(totalTricksInRound + 1, (trickValue) => {
                    return (
                      <NumberButton
                        key={trickValue}
                        onClick={() => {
                          if (readyToSubmit) {
                            return;
                          }
                          onChange(
                            Record.set(value, currentPlayer.id, trickValue)
                          );

                          setPlayerId((playerIndex + 1) % players.length);
                        }}
                        type="button"
                      >
                        {trickValue}
                      </NumberButton>
                    );
                  })}
                </div>
              </>
            ) : null}
            {error && (
              <div className="text-red-500 mt-2 bg-red-500/10 py-1 px-3 inline-block rounded-lg text-sm">
                {error.message}
              </div>
            )}

            {!Record.isEmptyRecord(value) ? (
              <div className="mt-4 flex justify-end">
                <Button
                  kind="secondary"
                  size="small"
                  onClick={() => {
                    const previousPlayerIndex =
                      (playerIndex - 1 + players.length) % players.length;

                    onChange(
                      Record.remove(value, players[previousPlayerIndex].id)
                    );
                    clearErrors("tricks");
                    setPlayerId(previousPlayerIndex);
                  }}
                  type="button"
                >
                  Undo last
                </Button>
              </div>
            ) : null}
          </div>
        )}
      />

      <SubmissionSummary
        type="trick"
        totalTricks={totalTricksInRound}
        currentSubmissions={Array.map(
          players,
          (player) => [player, currentTricks[player.id] ?? null] as const
        )}
      />

      {readyToSubmit ? (
        <div className="mb-4">
          <Button type="submit">Submit Tricks</Button>
        </div>
      ) : null}
    </form>
  );
};
