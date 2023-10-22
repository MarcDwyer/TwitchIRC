import { TwitchStream } from "@src/helix/types/liveFollowers";
import { atom } from "recoil";

export const followersState = atom<null | TwitchStream[]>({
  key: "followerState",
  default: null,
});
