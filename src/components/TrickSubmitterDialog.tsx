import { Dialog } from "radix-ui";
import React from "react";
import { Player, Round } from "../GameState";

import { TrickSubmitter } from "./TrickSubmitter";

interface Props {
  players: readonly Player[];
  submitTricks: (tricks: number[]) => void;
  round: Round;
  roundCount: number;
  existingTricks?: (number | null)[];
  trigger: React.ReactNode;
}

export const TrickSubmitterDialog = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{props.trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl mb-2">Submit Tricks</Dialog.Title>

          <Dialog.Description className="sr-only">
            Submit player tricks for round {props.round.number}
          </Dialog.Description>

          <TrickSubmitter {...props} onSubmitComplete={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
