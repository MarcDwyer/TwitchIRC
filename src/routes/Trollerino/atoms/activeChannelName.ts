import { atom } from "recoil";

export const activeChannelNameState = atom<string | null>({
  key: "activeChannelState",
  default: null,
});
