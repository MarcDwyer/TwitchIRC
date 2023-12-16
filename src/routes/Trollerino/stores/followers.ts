import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { create } from "zustand";
import { useCrendentialsStore } from "./credentials";
import { CLIENTID } from "@src/utils/oauth";

export type FollowersStoreState = {
  followers: null | TwitchStream[];
  getFollowers: () => Promise<void>;
};

export const useFollowersStore = create<FollowersStoreState>((set) => ({
  followers: null,
  getFollowers: async () => {
    try {
      const info = useCrendentialsStore.getState().info;
      if (!info) throw new Error("Info not set");
      const helixAPI = new HelixAPI({
        loginName: info.login,
        token: info.token,
        clientId: CLIENTID,
      });
      const [followersResp] = await helixAPI.getLiveFollowers();
      set({ followers: followersResp.data });
    } catch (_) {
      return set((state) => state);
    }
  },
}));
