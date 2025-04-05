import { Player } from "../GameState";

interface Props {
  players: Player[];
  removePlayer: (id: string) => void;
}
export const PlayerList = ({ players, removePlayer }: Props) => {
  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}{" "}
            <button onClick={() => removePlayer(player.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
