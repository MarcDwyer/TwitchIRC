import { useModal } from "@src/hooks/useModal";
import { BroadcastModal } from "./BroadcastModal";

export const BroadcastAll = () => {
  const { openModal, open, signal } = useModal<string>();
  // const { broadcast } = useTwitch().followers;
  return (
    <div className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer">
      <div
        onClick={async () => {
          try {
            const resp = await openModal();
            console.log({ resp });
          } catch (e) {}
        }}
      >
        Broadcast to All
      </div>
      <BroadcastModal signal={signal} open={open} />
    </div>
  );
};
