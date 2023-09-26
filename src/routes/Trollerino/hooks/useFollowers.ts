import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { useCallback, useEffect, useState } from "react";
import { UseTwitchChat } from "./useTwitchChat";
import { UseJoined } from "./useJoined";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getChannelName } from "@src/twitchChat/util";

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
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // once followers are fetched we connect to twitchchat
  const getFollowers = useCallback(async () => {
    try {
      setLoading(true);
      const [followers] = await helixAPI.getLiveFollowers();

      setStreams(followers.data);
      setLoading(false);
    } catch (e: any) {
      if ("message" in e) {
        toast(e.message, {
          onClose: () => navigate("/"),
        });
      } else {
        toast("Something went wrong");
      }
    }
  }, [navigate, setStreams, helixAPI, setLoading]);

  const broadcast = (msg: string) => {
    if (streams) {
      const channelNames = streams.map((stream) =>
        getChannelName(stream.user_login)
      );
      joined.joinChannels(streams);
      twitchChat.broadcast(channelNames, msg);
    } else {
      throw new Error("Followers don't exist");
    }
  };
  useEffect(() => {
    if (!streams && !loading) getFollowers();
  }, [getFollowers, streams, loading]);

  return {
    streams,
    broadcast,
  };
};
