import { TwitchChat } from "@src/twitchChat/twitch_chat";
import { useEffect, useMemo } from "react";

export type UseChatAPIParams = {
  token: string;
  loginName: string;
};

export const useChatAPI = ({ token, loginName }: UseChatAPIParams) => {
  const chatAPI = useMemo(
    () => new TwitchChat(token, loginName),
    [token, loginName]
  );

  useEffect(() => {
    return function () {
      if (chatAPI && chatAPI.ws) {
        chatAPI.disconnect();
      }
    };
  }, [chatAPI, loginName, token]);

  return chatAPI;
};
