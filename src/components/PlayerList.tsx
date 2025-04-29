import { Player } from "../GameState";
import { Array, pipe, Option } from "effect";
import classNames from "classnames";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Icon } from "./Icon";

interface Props {
  players: Player[];
  setPlayers: (players: Player[]) => void;
}
export const PlayerList = ({ players, setPlayers }: Props) => {
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    setPlayers(
      pipe(
        players,
        Array.remove(dragIndex),
        Array.insertAt(hoverIndex, players[dragIndex]),
        Option.getOrElse(() => players)
      )
    );
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 10, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const renderPlayer = (player: Player, index: number) => {
    return (
      <PlayerListItem
        player={player}
        key={player.id}
        index={index}
        moveCard={moveCard}
        removePlayer={() => {
          const filteredPlayers = Array.filter(
            players,
            (p) => p.id !== player.id
          );

          setPlayers(filteredPlayers);
        }}
      />
    );
  };

  return (
    <div>
      <h2 className="text-xl mb-4">Players</h2>
      <p className="text-stone-500 mb-4 text-sm">
        Sort the players in the order they are sat, with the first player being
        the dealer for the first round.
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = players.findIndex((p) => p.id === active.id);
            const newIndex = players.findIndex((p) => p.id === over?.id);

            moveCard(oldIndex, newIndex);
          }
        }}
      >
        <SortableContext items={players} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {players.map((player, index) => renderPlayer(player, index))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

interface PlayerListItemProps {
  player: Player;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  removePlayer: (id: string) => void;
}

const PlayerListItem = ({ player, removePlayer }: PlayerListItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      key={player.id}
      className={classNames(
        "border border-stone-300 py-2 px-4 rounded-lg bg-white flex justify-between gap-4 select-none",
        { "shadow-md opacity-80 z-50 relative": isDragging }
      )}
      style={style}
    >
      <button
        className="touch-manipulation cursor-move flex-grow text-left"
        type="button"
        {...listeners}
        {...attributes}
      >
        {player.name}
      </button>
      <div className="flex items-center gap-2 ">
        <button
          type="button"
          onClick={() => removePlayer(player.id)}
          className="cursor-pointer"
        >
          <span className="sr-only">Delete {player.name}</span>
          <Icon name="cross-1" className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};
