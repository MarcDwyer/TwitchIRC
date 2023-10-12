import { TwitchStream } from "@src/helix/types/liveFollowers";

type Props = {
  follower: TwitchStream;
  handleClick: () => void;
};

export const Follower = ({ follower, handleClick }: Props) => {
  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="w-full border-b-2 border-gray-500 h-20 flex hover:bg-gray-600 cursor-pointer"
    >
      <div className="m-auto flex">
        <span>{follower.user_name}</span>
      </div>
    </div>
  );
};
