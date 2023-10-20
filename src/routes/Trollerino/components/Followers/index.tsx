import { useRecoilValue } from "recoil";
import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { followersState } from "../../selectors/followers";
import { useJoined } from "../../hooks/useJoined";
import { useActiveChannel } from "../../hooks/useActiveChannel";

export const Followers = () => {
  const followers = useRecoilValue(followersState);
  const { join } = useJoined();
  const { setActiveChannel } = useActiveChannel();

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
