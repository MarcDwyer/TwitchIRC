import { TwitchChat } from "@src/twitchChat/twitch_chat";
import { useEffect, useState } from "react";

export type UseChatAPIParams = {
  token: string;
  loginName: string;
};

export const useChatAPI = ({ token, loginName }: UseChatAPIParams) => {
  const [chatAPI, setChatAPI] = useState<null | TwitchChat>(null);

  useEffect(() => {
    if (!chatAPI) {
      setChatAPI(new TwitchChat(token, loginName));
    }
    return function () {
      if (chatAPI && chatAPI.ws) {
        chatAPI.disconnect();
      }
    };
  }, [chatAPI, loginName, token]);

  return chatAPI;
};
