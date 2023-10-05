import { atom } from "recoil";
import { JoinedValue } from "../reducers/JoinedReducer";

export const joinedState = atom<Map<string, JoinedValue>>({
  key: "joined",
  default: new Map(),
});
