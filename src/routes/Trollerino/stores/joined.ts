import { create } from "zustand";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { TwitchCmds } from "../utils/twitchCmds";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { createChannelName } from "../utils/createChannelName";
import { bulkJoin } from "../utils/bulkJoin";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useWebSocketStore } from "./websocket";
import { useFollowersStore } from "./followers";
import { useCrendentialsStore } from "./credentials";
import { useActiveChannelStore } from "./activeChannel";
import { useChatStore } from "./chat";

export type JoinedMap = Map<string, JoinedValue>;

export type JoinedValue = {
  channelName: string;
  streamData: TwitchStream;
  mentioned: boolean;
  messages: IrcMessage[];
  paused: boolean;
  chatters: Set<string>;
};

export const createJoinedValue = (
  channelName: string,
  stream: TwitchStream
): JoinedValue => ({
  channelName,
  streamData: stream,
  mentioned: false,
  messages: [],
  paused: false,
  chatters: new Set(),
});

type JoinedStoreState = {
  joined: Map<string, JoinedValue>;
  updateJoined: (updatedJoined: JoinedMap) => void;
  part: (channelName: string) => void;
  join: (joinedValue: JoinedValue) => void;
  setPaused: (channelName: string, paused: boolean) => void;
  broadcast: (message: string) => void;
  resetMentioned: (channelName: string) => void;
  setMentioned: (channelName: string, mentioned: boolean) => void;
};

export const useJoinedStore = create<JoinedStoreState>((set) => ({
  joined: new Map(),
  updateJoined: (updatedJoined) => set(() => ({ joined: updatedJoined })),
  resetMentioned: (channelName) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      const channel = updatedJoined.get(channelName);
      if (channel) {
        const updatedChannel = {
          ...channel,
          mentioned: false,
        };
        return {
          joined: updatedJoined.set(channelName, updatedChannel),
        };
      }
      return state;
    }),
  setMentioned: (channelName, mentioned) =>
    set((state) => {
      const channel = state.joined.get(channelName);
      if (!channel) return state;
      const updatedChannel = {
        ...channel,
        mentioned,
      };

      return {
        joined: new Map(state.joined).set(channelName, updatedChannel),
      };
    }),
  part: (channelName) =>
    set((state) => {
      const { channel: activeChannel, resetActiveChannel } =
        useActiveChannelStore.getState();
      const isActive = activeChannel?.channelName === channelName;
      const updatedJoined = new Map(state.joined);
      updatedJoined.delete(channelName);
      const ws = useWebSocketStore.getState().ws;
      if (ws) {
        ws.send(TwitchCmds.part(channelName));
      }
      if (isActive) {
        resetActiveChannel();
      }
      return {
        joined: updatedJoined,
      };
    }),
  join: (joinedValue) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      updatedJoined.set(joinedValue.channelName, joinedValue);

      return { joined: updatedJoined };
    }),
  setPaused: (channelName, paused) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      const channel = updatedJoined.get(channelName);
      if (channel) {
        return {
          joined: updatedJoined.set(channelName, {
            ...channel,
            paused,
          }),
        };
      }
      return state;
    }),
  broadcast: (message) =>
    set((state) => {
      const ws = useWebSocketStore.getState().ws;
      const userLogin = useCrendentialsStore.getState().info?.login;
      if (!ws || !userLogin) return state;

      const addMsg = useChatStore.getState().addMessage;

      const followers = useFollowersStore.getState().followers ?? [];

      const [updatedJoined, notJoined] = bulkJoin(followers, state.joined);

      for (const joined of updatedJoined.values()) {
        if (notJoined.has(joined.channelName)) {
          ws.send(TwitchCmds.join(joined.channelName));
        }
        const ircMsg = createIRCMessage({
          username: userLogin,
          channelName: joined.channelName,
          message,
        });
        addMsg(ircMsg);
        ws.send(TwitchCmds.send(joined.channelName, message));
      }

      return { joined: updatedJoined };
    }),
}));
