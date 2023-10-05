import { selector } from "recoil";
import { credentialsState } from "../atoms/credentials";
import { TwitchChat } from "@src/twitchChat/twitch_chat";

export const chatAPIState = selector({
  key: "chatAPIState",
  get: ({ get }) => {
    const credentials = get(credentialsState);
    if (!credentials) {
      return null;
    }
    return new TwitchChat(credentials.token, credentials.loginName);
  },
});
