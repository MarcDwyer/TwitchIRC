import { selector } from "recoil";
import { credentialsState } from "../atoms/credentials";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";

export const ircSocketState = selector({
  key: "twitchChat",
  get: ({ get }) => {
    const creds = get(credentialsState);
    if (!creds) {
      return null;
    }
    const ws = new WebSocket(SecureIrcUrl);
    return ws;
  },
  set: ({ get, set }) => {
    console.log({ get, set });
  },
});
