import { create } from "zustand";

type Credentials = { login: string; token: string };
export type CredentialsStoreState = {
  info: Credentials | null;
  setInfo: (info: Credentials) => void;
};

export const useCrendentialsStore = create<CredentialsStoreState>((set) => ({
  info: null,
  setInfo: (info) => set({ info }),
}));
