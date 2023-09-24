import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { useEffect, useState } from "react";
import { UseTwitchChat } from "./useTwitchChat";
import { UseJoined } from "./useJoined";

type UseFollowersParams = {
  helixAPI: HelixAPI;
  twitchChat: UseTwitchChat;
  joined: UseJoined;
};
export type UseFollowers = ReturnType<typeof useFollowers>;

export const useFollowers = ({
  helixAPI,
  twitchChat,
  joined,
}: UseFollowersParams) => {
  const [streams, setStreams] = useState<null | TwitchStream[]>(null);

  async function getFollowers() {
    const { data } = await helixAPI.getLiveFollowers();
    setStreams(data);
  }
  useEffect(() => {
    if (!streams) getFollowers();
  }, [helixAPI]);

  const broadcast = (msg: string) => {
    if (streams) {
      const channelNames = streams.map((stream) => stream.user_login);
      twitchChat.broadcast(channelNames, msg);
      joined.joinChannels(streams);
    } else {
      throw new Error("Followers don't exist");
    }
  };
  return {
    streams,
    broadcast,
  };
};
