import { Follower } from "./Follower";
import { useFollowersStore } from "../../stores/followers";
import { useJoinedStore } from "../../stores/joined";
import { useActiveChannelStore } from "../../stores/activeChannel";
import { createChannelName } from "../../utils/createChannelName";

export const Followers = () => {
  const join = useJoinedStore((store) => store.join);
  const followers = useFollowersStore((store) => store.followers);
  const setActiveChannel = useActiveChannelStore(
    (store) => store.setActiveChannel
  );
  return (
    <>
      {followers ? (
        <>
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
    </>
  );
};
