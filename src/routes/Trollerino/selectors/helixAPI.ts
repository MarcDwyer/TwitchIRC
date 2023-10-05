import { HelixAPI } from "@src/helix";
import { selector } from "recoil";
import { credentialsState } from "../atoms/credentials";
import { CLIENTID } from "@src/utils/oauth";

export const helixState = selector<null | HelixAPI>({
  key: "helixState",
  get: ({ get }) => {
    const creds = get(credentialsState);
    if (!creds) {
      return null;
    }
    return new HelixAPI({
      loginName: creds.loginName,
      token: creds.token,
      clientId: CLIENTID,
    });
  },
});
