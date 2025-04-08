import React from "react";
import { AddPlayerForm } from "./AddPlayerForm";
import { isNonEmptyArray } from "effect/Array";
import {
  DEFAULT_BONUS,
  DEFAULT_ROUNDS_IN_GAME,
  GameStateConfig,
  Player,
} from "../GameState";
import { Button } from "./Button";
import { PlayerList } from "./PlayerList";
import { Either, pipe, Schema } from "effect";
import { Dialog } from "radix-ui";
import { Input } from "./Input";
import { Controller, useForm } from "react-hook-form";

interface Props {
  startGame: (config: GameStateConfig) => void;
}

const PlayerSchema = Schema.NonEmptyArray(
  Schema.Struct({
    id: Schema.String,
    name: Schema.String,
  })
);

const getPersistedPlayers = (): Player[] =>
  pipe(
    localStorage.getItem("players") ?? "{}",
    Schema.decodeUnknownEither(Schema.parseJson(PlayerSchema)),
    Either.map((players) => Array.from(players)),
    Either.getOrElse(() => [])
  );

export const PlayerSetup = ({ startGame }: Props) => {
  const defaultValues = React.useMemo(() => {
    const players = getPersistedPlayers();
    return {
      players: players,
      rounds: DEFAULT_ROUNDS_IN_GAME,
      bidBonus: DEFAULT_BONUS,
    };
  }, []);

  const { register, control, handleSubmit } = useForm({ defaultValues });

  return (
    <div className="max-w-screen-sm mx-auto space-y-6">
      <h1 className="text-2xl">New Game</h1>

      <Controller
        control={control}
        name="players"
        rules={{
          validate: (value) =>
            value.length < 2 ? "Add at least 2 players" : undefined,
        }}
        render={({
          field: { value: currentPlayers, onChange },
          fieldState: { error },
        }) => {
          return (
            <>
              <AddPlayerForm
                onAddPlayer={(player) => {
                  onChange([...currentPlayers, player]);
                }}
              />

              <PlayerList players={currentPlayers} setPlayers={onChange} />
              {error?.message && (
                <div className="text-red-500 text-sm my-2">{error.message}</div>
              )}
            </>
          );
        }}
      />

      <form
        className="flex justify-between items-center gap-4 mt-8"
        onSubmit={handleSubmit((values) => {
          const players = values.players;
          if (!isNonEmptyArray(players)) {
            throw new Error("Players array is empty");
          }
          // persist the chosen players to storage for next time
          localStorage.setItem("players", JSON.stringify(players));

          startGame({
            players: values.players,
            roundCount: values.rounds,
            bonus: values.bidBonus,
          });
        })}
      >
        <Button type="submit">Start Game</Button>

        <Dialog.Root>
          <div className="grid place-items-center">
            <Dialog.Trigger asChild>
              <Button type="button" kind="secondary">
                More settings
              </Button>
            </Dialog.Trigger>
          </div>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <Dialog.Title className="text-2xl mb-2">
                Game settings
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                More settings to configure the game
              </Dialog.Description>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Rounds"
                    type="number"
                    step={1}
                    min={"1"}
                    defaultValue={DEFAULT_ROUNDS_IN_GAME}
                    inputClassName="w-18"
                    inputMode="numeric"
                    {...register("rounds", {
                      valueAsNumber: true,
                      required: true,
                      min: 1,
                    })}
                  />
                  <Input
                    label="Bid bonus"
                    type="number"
                    step={1}
                    min={"1"}
                    defaultValue={DEFAULT_BONUS}
                    inputClassName="w-18"
                    inputMode="numeric"
                    {...register("bidBonus", {
                      valueAsNumber: true,
                      required: true,
                      min: 1,
                    })}
                  />
                </div>
                <Dialog.Close asChild>
                  <Button type="button" kind="secondary">
                    Done
                  </Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </form>
    </div>
  );
};
