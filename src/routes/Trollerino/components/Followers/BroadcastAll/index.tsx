import { useModal } from "@src/hooks/useModal";
import { BroadcastModal } from "./BroadcastModal";
import { useJoined } from "@src/routes/Trollerino/hooks/useJoined";

export const BroadcastAll = () => {
  const { broadcast } = useJoined();
  const { openModal, open, closeModal } = useModal();
  return (
    <div className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer">
      <div onClick={openModal} className="m-auto">
        Broadcast to All
      </div>
      <BroadcastModal
        open={open}
        closeModal={closeModal}
        onSubmit={(message) => {
          broadcast(message);
        }}
      />
    </div>
  );
};
