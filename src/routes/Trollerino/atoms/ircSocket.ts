import { atom } from "recoil";

export const ircSocketState = atom<WebSocket | null>({
  key: "ircSocketState",
  default: null,
});
