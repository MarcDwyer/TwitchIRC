import { useTwitch } from "../../context/twitchCtx";
import { BroadcastAll } from "./broadcastAll";
import { Follower } from "./follower";

export const Followers = () => {
  const { followers } = useTwitch();

  return (
    <>
      {!followers.streams ? (
        <span>Getting followers...</span>
      ) : (
        <div className="flex flex-col bg-gray-800 w-1/6">
          <BroadcastAll />
          {followers.streams.map((stream) => (
            <Follower key={stream.user_id} follower={stream} />
          ))}
        </div>
      )}
    </>
  );
};
