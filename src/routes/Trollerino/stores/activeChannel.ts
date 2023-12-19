import { create } from "zustand";
import { JoinedValue } from "./joined";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { useMessagesStore } from "./messages";
// import { JoinedValue, useJoinedStore } from "./joined";
// import { useCrendentialsStore } from "./credentials";
// import { createIRCMessage } from "../utils/createIrcMessage";
// import { useWebSocketStore } from "./websocket";
// import { TwitchCmds } from "../utils/twitchCmds";

export type ActiveChannelState = {
  channel: JoinedValue | null;
  messages: IrcMessage[];
  setMessages: (ircMsgs: IrcMessage[]) => void;
  setActiveChannel: (channelName: JoinedValue | null) => void;
  // setPaused: (pause: boolean) => void;
  // send: (msg: string) => void;
  // updateActiveChannel: (channel: JoinedValue | null) => void;
};

export const useActiveChannelStore = create<ActiveChannelState>((set) => ({
  channel: null,
  messages: [],
  setMessages: (messages) => set({ messages }),
  setActiveChannel: (channel) =>
    set(() => {
      const messages = channel
        ? useMessagesStore.getState().messages.get(channel.channelName) ?? []
        : [];
      return {
        channel,
        messages,
      };
    }),
  // setPaused: (pause) => {
  //   set((state) => {
  //     if (!state.channel) return state;
  //     return {
  //       channel: {
  //         ...state.channel,
  //         paused: pause,
  //       },
  //     };
  //   });
  // },
  // send: (message) =>
  //   set((state) => {
  //     const creds = useCrendentialsStore.getState().info;
  //     const ws = useWebSocketStore.getState().ws;
  //     if (!creds || !state.channel || !ws) return state;
  //     ws.send(TwitchCmds.send(state.channel.channelName, message));
  //     const ircMsg = createIRCMessage({
  //       username: creds?.login,
  //       message,
  //       channelName: state.channel?.channelName,
  //     });
  //     const updatedChannel: JoinedValue = {
  //       ...state.channel,
  //       messages: [...state.channel.messages, ircMsg],
  //     };
  //     return {
  //       channel: updatedChannel,
  //     };
  //   }),
}));
