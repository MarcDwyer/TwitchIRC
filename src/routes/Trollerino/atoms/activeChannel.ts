import { atom } from "recoil";
import { JoinedAtomValue } from "./joined";

export const activeChannelState = atom<JoinedAtomValue | null>({
  key: "activeChannelState",
  default: null,
});
