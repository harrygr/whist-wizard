import { Dialog } from "radix-ui";
import React from "react";
import { Button } from "./Button";
import { Player, Round } from "../GameState";
import { BidSubmitter } from "./BidSubmitter";

interface Props {
  players: readonly Player[];
  submitBids: (bids: number[]) => void;
  round: Round;
  roundCount: number;
}

export const BidSubmitterDialog = (props: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="grid place-items-center p-4">
        <Dialog.Trigger asChild>
          <Button type="button">Submit Bids</Button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md p-6 bg-white rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="text-2xl mb-2">Submit Bids</Dialog.Title>

          <Dialog.Description className="sr-only">
            Submit player bids for round {props.round.number}
          </Dialog.Description>

          <BidSubmitter {...props} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
