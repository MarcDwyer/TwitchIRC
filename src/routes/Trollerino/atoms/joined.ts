import { atom } from "recoil";
import { TwitchStream } from "@src/helix/types/liveFollowers";

export type JoinedAtomValue = {
  channelName: string;
  streamData: TwitchStream;
  mentioned: boolean;
};

export const createJoinedAtomVal = (
  channelName: string,
  stream: TwitchStream
): JoinedAtomValue => ({
  channelName,
  streamData: stream,
  mentioned: false,
});

export const joinedState = atom<Map<string, JoinedAtomValue>>({
  key: "joined",
  default: new Map(),
});
