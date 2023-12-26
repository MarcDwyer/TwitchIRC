import { HelixAPI } from "@src/helix";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { create } from "zustand";
import { CLIENTID } from "@src/utils/oauth";
import { useCrendentialsStore } from "./credentials";

export type FollowersStoreState = {
  followers: null | TwitchStream[];
  getFollowers: () => Promise<void>;
  error: { status: number; message: string } | null;
};

export const useFollowersStore = create<FollowersStoreState>((set) => ({
  followers: null,
  error: null,
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
      set({ followers: followersResp.data, error: null });
    } catch (err) {
      if (err instanceof Response) {
        return set({
          error: {
            message:
              "Authentication failed. Please login in with correct credentials.",
            status: 401,
          },
        });
      }
      if (err instanceof Error) {
        return set({
          error: { message: err.message, status: -1 },
        });
      }
      return set((state) => state);
    }
  },
}));
