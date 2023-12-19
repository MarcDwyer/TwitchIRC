import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { create } from "zustand";
import { CLIENTID } from "@src/utils/oauth";
import { useCrendentialsStore } from "./credentials";

export type FollowersStoreState = {
  followers: null | TwitchStream[];
  getFollowers: () => Promise<void>;
};

export const useFollowersStore = create<FollowersStoreState>((set) => ({
  followers: null,
  getFollowers: async () => {
    try {
      const creds = useCrendentialsStore.getState().info;
      if (!creds) throw new Error("Credentials not yet set");
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
