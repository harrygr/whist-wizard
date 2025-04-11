import { useForm, Controller } from "react-hook-form";
import { Player, Round } from "../GameState";
import React from "react";
import { Option, pipe, Array, Record } from "effect";
import { NumberButton } from "./NumberButton";
import { SubmissionSummary } from "./SubmissionSummary";
import { Button } from "./Button";
import { tricksInRound } from "../util/tricksInRound";

interface Props {
  players: readonly Player[];
  submitTricks: (bids: number[]) => void;
  round: Round;
  roundCount: number;
}

export const TrickSubmitter = ({
  players,
  submitTricks,
  round,
  roundCount,
}: Props) => {
  const dealerOffset = pipe(
    players,
    Array.findFirstIndex((player) => player.id === round.dealer),
    Option.filter((index) => index >= 0),
    Option.map((index) => (index + 1 + players.length) % players.length),
    Option.getOrElse(() => 0)
  );

  const totalTricksInRound = tricksInRound(roundCount, round.number);
  const { handleSubmit, clearErrors, control, trigger, watch } = useForm<{
    tricks: Record<string, number>;
  }>({ defaultValues: { tricks: {} } });

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
                  : "Total tricks must equal the total tricks in the round"
            ),
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            {!readyToSubmit ? (
              <>
                <h3 className="text-xl mb-4">{currentPlayer.name}</h3>

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
            {error && <div className="text-red-500 mt-2">{error.message}</div>}

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
