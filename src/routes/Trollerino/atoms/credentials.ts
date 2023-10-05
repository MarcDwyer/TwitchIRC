import { atom } from "recoil";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export const credentialsState = atom<TwitchCredentials | null>({
  key: "credentials",
  default: null,
});
