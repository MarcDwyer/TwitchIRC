import { create } from "zustand";
import { JoinedValue } from "./joined";
import { useChatStore } from "./chat";

export type ActiveChannelState = {
  channel: JoinedValue | null;
  paused: boolean;
  showStream: boolean;
  setActiveChannel: (channelName: JoinedValue) => void;
  resetActiveChannel: () => void;
  setPaused: (pause: boolean) => void;
  setShowStream: (show: boolean) => void;
};

export const useActiveChannelStore = create<ActiveChannelState>((set) => ({
  channel: null,
  paused: false,
  chat: null,
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
}));
