import { create } from "zustand";
import { JoinedValue } from "./joined";
import { Chat, useChatStore } from "./chat";
import {
  CreateIRCMessageParams,
  createIRCMessage,
} from "../utils/createIrcMessage";
import { useCrendentialsStore } from "./credentials";
import { useWebSocketStore } from "./websocket";
import { TwitchCmds } from "../utils/twitchCmds";

export type ActiveChannelState = {
  channel: JoinedValue | null;
  paused: boolean;
  showStream: boolean;
  chat: Chat;
  setActiveChannel: (channelName: JoinedValue) => void;
  resetActiveChannel: () => void;
  setPaused: (pause: boolean) => void;
  setShowStream: (show: boolean) => void;
  sendMsg: (msg: string) => void;
};
const createDefaultChat = (): Chat => ({ chatters: new Set(), messages: [] });
export const useActiveChannelStore = create<ActiveChannelState>((set) => ({
  channel: null,
  paused: false,
  chat: createDefaultChat(),
  showStream: false,
  setShowStream: (show) => set({ showStream: show }),
  setActiveChannel: (channel) =>
    set(() => {
      const chat = channel;
      useChatStore.getState().chatMap.get(channel.channelName);

      return {
        channel,
        chat,
        showStream: false,
      };
    }),
  resetActiveChannel: () =>
    set({
      channel: null,
      paused: false,
      showStream: false,
    }),
  setPaused: (pause) => set({ paused: pause }),
  setChat: (chat: Chat) => set({ chat }),
  sendMsg: (msg: string) =>
    set((state) => {
      const ws = useWebSocketStore.getState().ws;
      if (ws) {
        const chat = { ...state.chat };
        const ircMsgParams: CreateIRCMessageParams = {
          username: useCrendentialsStore.getState().info?.login ?? "",
          channelName: state.channel?.channelName ?? "",
          message: msg,
        };
        ws.send(TwitchCmds.send(ircMsgParams.channelName, msg));
        chat.messages.push(createIRCMessage(ircMsgParams));
        return { chat };
      } else {
        console.error(`Attempted to send msg with no WS connection`);
        return state;
      }
    }),
}));
