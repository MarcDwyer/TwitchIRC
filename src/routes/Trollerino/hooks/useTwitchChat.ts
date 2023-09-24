import { Channel } from "@src/twitchChat/channel";
import { TwitchChat } from "@src/twitchChat/twitch_chat";
import { getChannelName } from "@src/twitchChat/util";
import { useCallback, useEffect, useState } from "react";

export type ChannelMap = Map<string, Channel>;
export type UseTwitchChat = ReturnType<typeof useTwitchChat>;

export type UseTwitchChatParams = {
  token: string;
  loginName: string;
  chatAPI: TwitchChat;
};
export const useTwitchChat = (chatAPI: TwitchChat | null) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!connected && chatAPI && !connecting) {
      console.log("called connect...");
      connect();
    }
  }, [connected, chatAPI, connecting]);

  const connect = useCallback(async () => {
    try {
      if (!chatAPI) {
        throw new Error("Twitch Chat has not been set");
      }
      setConnecting(true);
      await chatAPI.connect();
      setConnected(true);
      console.log("connected.");
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting(false);
    }
  }, [chatAPI]);

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
