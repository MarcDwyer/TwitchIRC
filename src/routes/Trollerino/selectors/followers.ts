import { selector } from "recoil";
import { helixState } from "./helixAPI";

export const followersState = selector({
  key: "followersState",
  get: async ({ get }) => {
    const helixAPI = get(helixState);
    if (!helixAPI) {
      return null;
    }
    try {
      const [followers] = await helixAPI.getLiveFollowers();
      return followers.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
});
