import { useEffect } from "react";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Credentials, useCrendentialsStore } from "./stores/credentials";
import { useWebSocketStore } from "./stores/websocket";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { Nav } from "./components/Nav";
import { useFollowersStore } from "./stores/followers";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const setInfo = useCrendentialsStore((store) => store.setInfo);
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
      setInfo(creds);
      getFollowers(creds);
      const websocket = new WebSocket(SecureIrcUrl);
      setWs(websocket);
    } else {
      navigate("/");
    }
  }, [searchParams, setInfo, setWs, getFollowers]);

  return (
    <div className="h-full w-full flex">
      <Nav />
      <IRCView />
    </div>
  );
}
