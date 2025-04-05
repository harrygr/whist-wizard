import { Player } from "../GameState";
import React from "react";
import { Array, pipe, Option } from "effect";
import classNames from "classnames";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
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

interface Props {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  removePlayer: (id: string) => void;
}
export const PlayerList = ({ players, setPlayers, removePlayer }: Props) => {
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const renderPlayer = React.useCallback((player: Player, index: number) => {
    return (
      <PlayerListItem
        player={player}
        key={player.id}
        index={index}
        moveCard={moveCard}
        removePlayer={() => removePlayer(player.id)}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        "border border-stone-300 py-2 px-4 rounded-lg bg-white flex justify-between gap-4",
        { "shadow-lg opacity-80 z-50 relative": isDragging }
      )}
      style={style}
    >
      {player.name}{" "}
      <div className="flex items-center gap-2">
        <button
          onClick={() => removePlayer(player.id)}
          className="cursor-pointer"
        >
          🗑️
        </button>
        <button {...attributes} {...listeners} className="cursor-move">
          ⬜️
        </button>
      </div>
    </li>
  );
};
