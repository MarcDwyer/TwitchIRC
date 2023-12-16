import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { useFollowersStore } from "../../stores/followers";
import { useEffect } from "react";
import { useCrendentialsStore } from "../../stores/credentials";
import { useJoinedStore } from "../../stores/joined";
import { useActiveChannelStore } from "../../stores/activeChannel";
import { createChannelName } from "../../utils/createChannelName";

export const Followers = () => {
  const join = useJoinedStore((store) => store.join);
  const { followers, getFollowers } = useFollowersStore((store) => store);
  const info = useCrendentialsStore((store) => store.info);
  const setActiveChannel = useActiveChannelStore(
    (store) => store.setActiveChannel
  );

  useEffect(() => {
    if (info && !followers) {
      getFollowers();
    }
  }, [followers, getFollowers, info]);

  return (
    <div className="flex flex-col bg-gray-800 w-48 flex-none">
      {followers ? (
        <>
          <BroadcastAll />
          {followers.map((stream) => (
            <Follower
              handleClick={() => {
                // shit
                const channelName = createChannelName(stream.user_login);
                join(stream);
                setActiveChannel(channelName);
              }}
              key={stream.user_id}
              follower={stream}
            />
          ))}
        </>
      ) : (
        <span>Loading followers...</span>
      )}
    </div>
  );
};
