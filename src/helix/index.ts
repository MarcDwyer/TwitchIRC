import { UserData, UserDataResponse } from "./user_info.ts";
import { TwitchLiveFollowersResponse } from "./types/liveFollowers.js";
import { NavigateFunction } from "react-router-dom";

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

  constructor(
    private credentials: HelixAPIParams,
    private navigate: NavigateFunction
  ) {}

  async getLiveFollowers() {
    const url = new URL(HelixURLS.liveFollowers);
    const userData = await this.getUserData();

    url.searchParams.set("user_id", userData.id);

    return this.fetchHelix<TwitchLiveFollowersResponse>(url.toString());
  }
  async fetchHelix<T>(url: string): Promise<T> {
    const { token, clientId } = this.credentials;
    try {
      const helixResponse = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": clientId,
        },
      });

      return helixResponse.json();
    } catch (e) {
      this.navigate("/");
      throw e;
    }
  }
  async getUserData() {
    if (this.userData) {
      return this.userData;
    }
    const url = new URL(HelixURLS.userData);
    url.searchParams.set("login", this.credentials.loginName);
    const response = await this.fetchHelix<UserDataResponse>(url.toString());
    this.userData = response.data[0];
    return this.userData;
  }
}
