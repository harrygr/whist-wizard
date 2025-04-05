import { nanoid } from "nanoid";
import { Player } from "../GameState";

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
  return (
    <form onSubmit={onSubmit}>
      <h2>Add players</h2>
      <label>Player name</label>
      <input type="text" name="name" className="border" />
      <button type="submit">Add player</button>
    </form>
  );
};
