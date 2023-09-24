import { useTwitch } from "../../context/twitchCtx";

export const BroadcastAll = () => {
  // const { broadcast } = useTwitch().followers;
  return (
    <div className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer">
      <div className="m-auto flex">Broadcast to All</div>
    </div>
  );
};
