import { atom } from "recoil";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { IrcMessage } from "@src/twitchChat/twitch_data";

export type JoinedAtomValue = {
  channelName: string;
  streamData: TwitchStream;
  mentioned: boolean;
  messages: IrcMessage[];
  paused: boolean;
};

export const createJoinedAtomVal = (
  channelName: string,
  stream: TwitchStream
): JoinedAtomValue => ({
  channelName,
  streamData: stream,
  mentioned: false,
  messages: [],
  paused: false,
});

export const joinedState = atom<Map<string, JoinedAtomValue>>({
  key: "joined",
  default: new Map(),
});
