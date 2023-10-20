import { selector } from "recoil";
import { helixState } from "./helixAPI";

export const userDataState = selector({
  key: "userDataState",
  get: async ({ get }) => {
    const helixAPI = get(helixState);
    if (helixAPI) {
      const userData = await helixAPI?.getUserData();
      return userData;
    }
    return null;
  },
});
