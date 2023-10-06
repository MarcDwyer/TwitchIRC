import { useModal } from "@src/hooks/useModal";
import { BroadcastModal } from "./BroadcastModal";
import { useCallback } from "react";
import { useTwitch } from "@src/routes/Trollerino/context/twitchCtx";

export const BroadcastAll = () => {
  const { openModal, open, signal } = useModal<string>();

  const handleBroadcastClick = useCallback(async () => {
    try {
      const message = await openModal();
      console.log({ message });
    } catch (e) {}
  }, [openModal]);

  return (
    <div
      onClick={handleBroadcastClick}
      className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer"
    >
      <div className="m-auto">Broadcast to All</div>
      <BroadcastModal signal={signal} open={open} />
    </div>
  );
};
