import { Suspense, useEffect } from "react";
import { Followers } from "./components/Followers/index";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useIRCWebsocket } from "./hooks/useIRCWebsocket";
import { useWebSocketStore } from "./stores/websocket";
import { useCrendentialsStore } from "./stores/credentials";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const setWs = useWebSocketStore((store) => store.setWs);
  const setInfo = useCrendentialsStore((store) => store.setInfo);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { websocket } = useIRCWebsocket();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const loginName = searchParams.get("loginName");

    if (accessToken && loginName) {
      setInfo({
        login: loginName,
        token: accessToken,
      });
    } else {
      navigate("/");
    }
  }, [searchParams, setInfo]);

  useEffect(() => {
    if (websocket) {
      setWs(websocket);
    }
  }, [websocket, setWs]);

  return (
    <div className="h-full w-full flex">
      <Followers />
      <IRCView />
    </div>
  );
}
