import { useRecoilValue } from "recoil";
import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { followersState } from "../../selectors/followers";
import { useJoined } from "../../hooks/useJoined";

export const Followers = () => {
  const followers = useRecoilValue(followersState);
  const { join } = useJoined();

  return (
    <div className="flex flex-col bg-gray-800 w-48 flex-none">
      <BroadcastAll />
      {followers &&
        followers.map((stream) => (
          <Follower
            handleClick={() => {
              join(stream);
            }}
            key={stream.user_id}
            follower={stream}
          />
        ))}
    </div>
  );
};
