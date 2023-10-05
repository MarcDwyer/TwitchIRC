import { useRecoilValue } from "recoil";
import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { followersState } from "../../selectors/followers";

export const Followers = () => {
  const followers = useRecoilValue(followersState);

  console.log({ followers });
  return (
    <div className="flex flex-col bg-gray-800 w-1/6">
      {/* <BroadcastAll /> */}
      {followers &&
        followers.map((stream) => (
          <Follower key={stream.user_id} follower={stream} />
        ))}
    </div>
  );
};
