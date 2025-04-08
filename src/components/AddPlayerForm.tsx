import { nanoid } from "nanoid";
import { Player } from "../GameState";
import { Button } from "./Button";
import React from "react";
import { Input } from "./Input";

interface Props {
  onAddPlayer: (player: Player) => void;
}

export const AddPlayerForm = ({ onAddPlayer }: Props) => {
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name");
    if (!name || typeof name !== "string") {
      return;
    }
    onAddPlayer({ id: nanoid(6), name });
    form.reset();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex-shrink min-w-0">
          <Input label="Player name" autoFocus autoComplete="off" name="name" />
        </div>
        <div className="flex-shrink-0">
          <Button type="submit" size="small" kind="secondary">
            Add player
          </Button>
        </div>
      </div>
    </form>
  );
};
