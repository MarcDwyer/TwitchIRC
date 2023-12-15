import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { useJoined } from "../../hooks/useJoined";
import { useActiveChannel } from "../../hooks/useActiveChannel";
import { useFollowers } from "../../hooks/useFollowers";

export const Followers = () => {
  const { join } = useJoined();
  const { setActiveChannel } = useActiveChannel();
  const { followers } = useFollowers();

  return (
    <div className="flex flex-col bg-gray-800 w-48 flex-none">
      <BroadcastAll />
      {followers &&
        followers.map((stream) => (
          <Follower
            handleClick={() => {
              const joined = join(stream);
              if (joined) {
                setActiveChannel(joined.channelName);
              }
            }}
            key={stream.user_id}
            follower={stream}
          />
        ))}
    </div>
  );
};
