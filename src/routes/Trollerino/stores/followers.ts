import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { create } from "zustand";
import { CLIENTID } from "@src/utils/oauth";
import { Credentials } from "./credentials";

export type FollowersStoreState = {
  followers: null | TwitchStream[];
  getFollowers: (creds: Credentials) => Promise<void>;
};

export const useFollowersStore = create<FollowersStoreState>((set) => ({
  followers: null,
  getFollowers: async (creds) => {
    try {
      const helixAPI = new HelixAPI({
        loginName: creds.login,
        token: creds.token,
        clientId: CLIENTID,
      });
      const [followersResp] = await helixAPI.getLiveFollowers();
      set({ followers: followersResp.data });
    } catch (_) {
      return set((state) => state);
    }
  },
}));
