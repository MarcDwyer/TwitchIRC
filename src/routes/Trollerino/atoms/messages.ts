import { IrcMessage } from "@src/twitchChat/twitch_data";
import { atom } from "recoil";

export type MessagesAtom = Map<string, IrcMessage[]>;

export const messagesState = atom<MessagesAtom>({
  key: "messagesState",
  default: new Map(),
});
