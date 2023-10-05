import { TwitchStream } from "@src/helix/types/liveFollowers";
import { useRecoilState } from "recoil";
import { joinedState } from "../../atoms/joined";

type Props = {
  follower: TwitchStream;
};

export const Follower = ({ follower }: Props) => {
  // const { joined } = useTwitch();
  const [_, setJoined] = useRecoilState(joinedState);

  // const alreadyJoined = joined.checkIfJoined(follower.user_login);

  const addStream = (stream: TwitchStream) => {};

  return (
    <div
      onClick={() => {
        // if (!alreadyJoined) {
        //   joined.joinChannels([follower]);
        // }
      }}
      className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer"
    >
      <div className="m-auto flex">
        <span>{follower.user_name}</span>
      </div>
    </div>
  );
};
