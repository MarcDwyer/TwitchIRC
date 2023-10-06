import { useRecoilState, useRecoilValue } from "recoil";
import { BroadcastAll } from "./BroadcastAll";
import { Follower } from "./Follower";
import { followersState } from "../../selectors/followers";
import { ircSocketState } from "../../selectors/twitchChat";
import { createJoinedAtomVal, joinedState } from "../../atoms/joined";

export const Followers = () => {
  const followers = useRecoilValue(followersState);
  const ws = useRecoilValue(ircSocketState);
  const [, setJoinedState] = useRecoilState(joinedState);

  return (
    <div className="flex flex-col bg-gray-800 w-1/6">
      <BroadcastAll />
      {followers &&
        followers.map((stream) => (
          <Follower
            handleClick={() => {
              if (ws) {
                const channelName = `#${stream.user_login.toLowerCase()}`;
                ws.send(`JOIN ${channelName}`);
                setJoinedState((currJoined) => {
                  return new Map(currJoined).set(
                    channelName,
                    createJoinedAtomVal(channelName, stream)
                  );
                });
              }
            }}
            key={stream.user_id}
            follower={stream}
          />
        ))}
    </div>
  );
};
