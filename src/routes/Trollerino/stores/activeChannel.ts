import { create } from "zustand";

export type ActiveChannelState = {
  channelName: string | null;
  setActiveChannel: (channelName: string) => void;
};

export const useActiveChannelStore = create<ActiveChannelState>((set) => ({
  channelName: null,
  setActiveChannel: (channelName) => set({ channelName }),
}));
