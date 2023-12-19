import { useEffect } from "react";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Credentials, useCrendentialsStore } from "./stores/credentials";
import { useWebSocketStore } from "./stores/websocket";
import { Nav } from "./components/Nav";
import { useFollowersStore } from "./stores/followers";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const credentials = useCrendentialsStore();
  const setWs = useWebSocketStore((store) => store.setWs);
  const getFollowers = useFollowersStore((store) => store.getFollowers);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const loginName = searchParams.get("loginName");

    if (accessToken && loginName) {
      const creds: Credentials = {
        login: loginName,
        token: accessToken,
      };
      credentials.setInfo(creds);
    } else {
      navigate("/");
    }
  }, [searchParams, credentials.setInfo, setWs, getFollowers]);

  useEffect(() => {
    let followerTimer: number | undefined;
    if (credentials.info) {
      getFollowers();
      setWs();
      if (followerTimer) clearInterval(followerTimer);
      followerTimer = setInterval(getFollowers, 10 * 60000);
    }
    return function () {
      if (followerTimer) {
        console.log("Clearing follower timer");
        clearInterval(followerTimer);
      }
    };
  }, [credentials.info]);

  return (
    <div className="h-full w-full flex">
      <Nav />
      <IRCView />
    </div>
  );
}
