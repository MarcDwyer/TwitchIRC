import { create } from "zustand";
import { JoinedValue } from "./joined";
import { Chat, useChatStore } from "./chat";
import { IrcMessage } from "@src/twitchChat/twitch_data";

export type ActiveChannelState = {
  channel: JoinedValue | null;
  paused: boolean;
  showStream: boolean;
  chat: Chat;
  setActiveChannel: (channelName: JoinedValue, chat?: Chat) => void;
  resetActiveChannel: () => void;
  setPaused: (pause: boolean) => void;
  setShowStream: (show: boolean) => void;
  addMsg: (ircMsg: IrcMessage) => void;
  setChat: (chat: Chat) => void;
};
const createDefaultChat = (): Chat => ({ chatters: new Set(), messages: [] });
export const useActiveChannelStore = create<ActiveChannelState>((set, get) => ({
  channel: null,
  paused: false,
  chat: createDefaultChat(),
  showStream: false,
  setShowStream: (show) => set({ showStream: show }),
  setActiveChannel: (channel) => {
    const chatMap = useChatStore.getState().chatMap;
    const chat = chatMap.get(channel.channelName) ?? createDefaultChat();
    if (chat) {
      set({ chat });
    }
    set({
      channel,
      showStream: false,
    });
  },

  resetActiveChannel: () =>
    set({
      channel: null,
      paused: false,
      showStream: false,
    }),
  setPaused: (pause) => set({ paused: pause }),
  setChat: (chat: Chat) => set({ chat }),
  addMsg: (ircMsg) =>
    set((state) => {
      const chat = { ...state.chat };
      chat.messages.push(ircMsg);
      return { chat };
    }),
}));
