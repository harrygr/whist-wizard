import { Player } from "../GameState";

interface Props {
  players: Player[];
  removePlayer: (id: string) => void;
}
export const PlayerList = ({ players, removePlayer }: Props) => {
  return (
    <div>
      <h2 className="text-xl mb-4">Players</h2>
      <p className="text-stone-500 mb-4 text-sm">
        Sort the players in the order they are sat, with the first player being
        the dealer for the first round.
      </p>
      <ul className="space-y-2">
        {players.map((player) => (
          <li
            key={player.id}
            className="border border-stone-300 py-2 px-4 rounded-lg"
          >
            {player.name}{" "}
            <button
              onClick={() => removePlayer(player.id)}
              className="cursor-pointer"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
