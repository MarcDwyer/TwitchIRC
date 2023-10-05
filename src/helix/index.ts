import { UserData, UserDataResponse } from "./user_info.ts";
import { TwitchLiveFollowersResponse } from "./types/liveFollowers.js";
import { checkIfError } from "@src/routes/Trollerino/utils/checkIfError.ts";

enum HelixURLS {
  liveFollowers = "https://api.twitch.tv/helix/streams/followed",
  authToken = "https://id.twitch.tv/oauth2/token",
  userData = "https://api.twitch.tv/helix/users",
}
export type HelixAPIParams = {
  token: string;
  clientId: string;
  loginName: string;
};
export class HelixAPI {
  oauth: string | undefined;
  userData: UserData | undefined;

  constructor(private credentials: HelixAPIParams) {}

  async getLiveFollowers(): Promise<[TwitchLiveFollowersResponse, UserData]> {
    const url = new URL(HelixURLS.liveFollowers);
    const userData = await this.getUserData();

    url.searchParams.set("user_id", userData.id);

    const followers = await this.fetchHelix<TwitchLiveFollowersResponse>(
      url.toString()
    );
    return [followers, userData];
  }
  async fetchHelix<T>(url: string): Promise<T & { error?: string }> {
    const { token, clientId } = this.credentials;
    const helixResponse = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": clientId,
      },
    });

    return helixResponse.json();
  }
  async getUserData() {
    const url = new URL(HelixURLS.userData);
    url.searchParams.set("login", this.credentials.loginName);
    const response = await this.fetchHelix<UserDataResponse>(url.toString());
    checkIfError(response);
    return response.data[0];
  }
}
