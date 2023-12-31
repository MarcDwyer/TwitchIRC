import { create } from "zustand";
import { JoinedValue } from "./joined";
import { Chat, createChat, useChatStore } from "./chat";

export type ActiveChannelState = {
  channel: JoinedValue | null;
  chat: Chat | null;
  paused: boolean;
  setChat: (chat: Chat) => void;
  setActiveChannel: (channelName: JoinedValue) => void;
  resetActiveChannel: () => void;
  setPaused: (pause: boolean) => void;
};

export const useActiveChannelStore = create<ActiveChannelState>((set) => ({
  channel: null,
  paused: false,
  chat: null,
  setChat: (chat) =>
    set((state) => {
      if (!state.paused) {
        return { chat };
      }
      // if paused dont update messages just chatters
      const updatedChat = state.chat ? { ...state.chat } : createChat();
      updatedChat.chatters = new Set(chat.chatters);
      return { chat: updatedChat };
    }),
  setActiveChannel: (channel) =>
    set(() => {
      const chat = channel
        ? useChatStore.getState().chatMap.get(channel.channelName)
        : createChat();

      return {
        channel,
        chat,
      };
    }),
  resetActiveChannel: () =>
    set({
      chat: null,
      channel: null,
      paused: false,
    }),
  setPaused: (pause) => set({ paused: pause }),
}));
