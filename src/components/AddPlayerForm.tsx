import { nanoid } from "nanoid";
import { Player } from "../GameState";
import { Button } from "./Button";
import React from "react";

interface Props {
  onAddPlayer: (player: Player) => void;
}

export const AddPlayerForm = ({ onAddPlayer }: Props) => {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    if (!name) {
      return;
    }
    onAddPlayer({ id: nanoid(6), name });
    form.reset();
  };

  const id = React.useId();
  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2 mb-4">
        <div className="">
          <label htmlFor={`${id}-name`} className="sr-only">
            Player name
          </label>
          <input
            autoFocus
            id={`${id}-name`}
            type="text"
            name="name"
            className="border border-stone-400 rounded h-9 px-2"
            placeholder="Player name"
            autoComplete="off"
          />
        </div>
        <Button type="submit" size="small" kind="secondary">
          Add player
        </Button>
      </div>
    </form>
  );
};
