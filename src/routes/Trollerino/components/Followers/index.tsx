import { Follower } from "./Follower";
import { useFollowersStore } from "../../stores/followers";
import { useJoinedStore } from "../../stores/joined";

export const Followers = () => {
  const join = useJoinedStore((store) => store.join);
  const followers = useFollowersStore((store) => store.followers);

  return (
    <>
      {followers ? (
        <>
          {followers.map((stream) => (
            <Follower
              handleClick={() => {
                join(stream);
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
