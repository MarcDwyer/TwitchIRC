import { useModal } from "@src/hooks/useModal";
import { BroadcastModal } from "./BroadcastModal";
import { useJoinedStore } from "@src/routes/Trollerino/stores/joined";

export const BroadcastAll = () => {
  const broadcast = useJoinedStore((store) => store.broadcast);
  const { openModal, open, closeModal } = useModal();
  return (
    <div className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer">
      <div onClick={openModal} className="m-auto">
        Broadcast to All
      </div>
      {open && (
        <BroadcastModal
          closeModal={closeModal}
          onSubmit={(message) => {
            broadcast(message);
          }}
        />
      )}
    </div>
  );
};
