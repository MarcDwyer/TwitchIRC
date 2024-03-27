import { Follower } from "./Follower";
import { useFollowersStore } from "../../stores/followers";
import { createJoinedValue, useJoinedStore } from "../../stores/joined";
import { useActiveChannelStore } from "../../stores/activeChannel";
import { createChannelName } from "../../utils/createChannelName";
import { useWebSocketStore } from "../../stores/websocket";
import { TwitchCmds } from "../../utils/twitchCmds";

export const Followers = () => {
  const join = useJoinedStore((store) => store.join);
  const followers = useFollowersStore((store) => store.followers);
  const setActiveChannel = useActiveChannelStore(
    (store) => store.setActiveChannel
  );
  const ws = useWebSocketStore((store) => store.ws);

  return (
    <>
      {followers ? (
        <>
          {followers.map((stream) => (
            <Follower
              handleClick={() => {
                const channelName = createChannelName(stream.user_login);
                if (ws) {
                  ws.send(TwitchCmds.join(channelName));
                }
                const joinedValue = createJoinedValue(channelName, stream);
                join(joinedValue);
                setActiveChannel(joinedValue);
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
