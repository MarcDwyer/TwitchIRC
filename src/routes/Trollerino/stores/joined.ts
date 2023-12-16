import { create } from "zustand";
import { JoinedAtomValue, createJoinedAtomVal } from "../atoms/joined";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { TwitchCmds } from "../utils/twitchCmds";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { createChannelName } from "../utils/createChannelName";
import { bulkJoin } from "../utils/bulkJoin";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useWebSocketStore } from "./websocket";
import { useFollowersStore } from "./followers";
import { isMentioned } from "../utils/isMentioned";
import { useCrendentialsStore } from "./credentials";

export type JoinedMap = Map<string, JoinedAtomValue>;

type JoinedStoreState = {
  joined: Map<string, JoinedAtomValue>;
  userLogin: string | null;
  updateJoined: (updatedJoined: JoinedMap) => void;
  setUserLogin: (userLogin: string) => void;
  addMessage: (ircMsg: IrcMessage) => void;
  part: (channelName: string) => void;
  join: (twitchStream: TwitchStream) => void;
  setPaused: (channelName: string, paused: boolean) => void;
  broadcast: (message: string) => void;
  resetMentioned: (channelName: string) => void;
};

export const useJoinedStore = create<JoinedStoreState>((set) => ({
  joined: new Map(),
  userLogin: null,
  setUserLogin: (userLogin) => set(() => ({ userLogin })),
  updateJoined: (updatedJoined) => set(() => ({ joined: updatedJoined })),
  resetMentioned: (channelName) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      const channel = updatedJoined.get(channelName);
      if (channel) {
        return {
          joined: updatedJoined.set(channelName, {
            ...channel,
            mentioned: false,
          }),
        };
      }
      return state;
    }),
  addMessage: (ircMsg) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      const channel = updatedJoined.get(ircMsg.channel);
      if (!channel) return state;
      let mentioned = channel.mentioned;
      const login = useCrendentialsStore.getState().info?.login;
      if (login) {
        mentioned = isMentioned(login, ircMsg.message);
      }
      return {
        joined: updatedJoined.set(ircMsg.channel, {
          ...channel,
          messages: [...channel.messages, ircMsg],
          mentioned,
        }),
      };
    }),
  part: (channelName) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      updatedJoined.delete(channelName);
      const ws = useWebSocketStore.getState().ws;
      if (ws) {
        ws.send(TwitchCmds.part(channelName));
      }
      return {
        joined: updatedJoined,
      };
    }),
  join: (stream) =>
    set((state) => {
      const updatedJoined = new Map(state.joined);
      const channelName = createChannelName(stream.user_login);
      updatedJoined.set(channelName, createJoinedAtomVal(channelName, stream));
      const ws = useWebSocketStore.getState().ws;
      if (ws) {
        ws.send(TwitchCmds.join(channelName));
      }
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

      if (!ws || !state.userLogin) return state;

      const followers = useFollowersStore.getState().followers ?? [];

      const updatedJoined = bulkJoin(followers, state.joined);

      for (const joined of updatedJoined.values()) {
        const ircMsg = createIRCMessage({
          username: state.userLogin,
          channelName: joined.channelName,
          message,
        });
        updatedJoined.set(joined.channelName, {
          ...joined,
          messages: [...joined.messages, ircMsg],
        });
        ws.send(TwitchCmds.send(joined.channelName, message));
      }

      return { joined: updatedJoined };
    }),
}));
