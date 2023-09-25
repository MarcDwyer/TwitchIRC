import { Channel } from "@src/twitchChat/channel";
import { TwitchChat } from "@src/twitchChat/twitch_chat";
import { getChannelName } from "@src/twitchChat/util";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

export type ChannelMap = Map<string, Channel>;
export type UseTwitchChat = ReturnType<typeof useTwitchChat>;

export type UseTwitchChatParams = {
  token: string;
  loginName: string;
  chatAPI: TwitchChat;
};

export const useTwitchChat = (chatAPI: TwitchChat) => {
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      if (!chatAPI) {
        throw new Error("Twitch Chat has not been set");
      }
      await chatAPI.connect();
      setConnected(true);
    } catch (e) {
      console.error(e);
      toast("Error connecting to twitch chat");
    }
  }, [chatAPI, setConnected, setConnected]);

  const disconnect = useCallback(() => {
    try {
      if (!chatAPI) {
        throw new Error("Twitch Chat has not been set");
      }
      chatAPI.disconnect();
      setConnected(false);
    } catch (e) {
      console.error(e);
    }
  }, [chatAPI]);

  const broadcast = (channelNames: string[], msg: string) => {
    if (!chatAPI) {
      throw new Error("Twitch Chat has not been set");
    }
    for (let channelName of channelNames) {
      channelName = getChannelName(channelName);
      let channel = chatAPI.channels.get(channelName);
      if (!channel) {
        channel = chatAPI.joinChannel(channelName)[0];
      }
      channel.send(msg);
    }
  };

  return {
    broadcast,
    connect,
    connected,
    disconnect,
  };
};
