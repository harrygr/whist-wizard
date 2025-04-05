import { useForm, Controller } from "react-hook-form";
import { Player, Round, TOTAL_ROUNDS, tricksInRound } from "../GameState";
import React from "react";
import { Option, pipe, Array, Record } from "effect";
import { NumberButton } from "./NumberButton";
import { SubmissionSummary } from "./SubmissionSummary";
import { Button } from "./Button";

interface Props {
  players: Player[];
  submitTricks: (bids: number[]) => void;
  round: Round;
}

export const TrickSubmitter = ({ players, submitTricks, round }: Props) => {
  const dealerOffset = pipe(
    Option.fromNullable(
      players.findIndex((player) => player.id === round.dealer)
    ),
    Option.filter((index) => index >= 0),
    Option.map((index) => (index - 1 + players.length) % players.length),
    Option.getOrElse(() => 0)
  );

  const totalTricks = tricksInRound(TOTAL_ROUNDS, round.number);
  const { handleSubmit, clearErrors, control, trigger, watch } = useForm<{
    tricks: Record<string, number>;
  }>({
    defaultValues: { tricks: {} },
  });
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
      className="max-w-sm mx-auto"
      onSubmit={handleSubmit((values) => {
        const tricks = players.map((player) => values.tricks[player.id]);
        return submitTricks(tricks);
      })}
    >
      <h2 className="text-2xl font-semibold mb-2">Player Tricks</h2>

      <p className="text-stone-500 mb-4">
        Round {round.number} • {totalTricks} cards
      </p>

      <Controller
        name="tricks"
        control={control}
        rules={{
          validate: (value) => {
            return Object.values(value).reduce(
              (acc, trick) => acc + trick,
              0
            ) === totalTricks
              ? undefined
              : "Total tricks must equal the total tricks in the round";
          },
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            {!readyToSubmit ? (
              <>
                <h3 className="text-xl mb-4">{currentPlayer.name}</h3>

                <div className="grid gap-4 grid-cols-4">
                  {Array.makeBy(totalTricks + 1, (trickValue) => {
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
        totalTricks={totalTricks}
        currentSubmissions={Array.filterMap(players, (player) =>
          pipe(
            Option.fromNullable(currentTricks[player.id]),
            Option.map((trick) => [player, trick])
          )
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
