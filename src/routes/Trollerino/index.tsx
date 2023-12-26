import { useCallback, useEffect } from "react";
import { IRCView } from "./components/IRCView";
import { Nav } from "./components/Nav";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Credentials, useCrendentialsStore } from "./stores/credentials";
import { useWebSocketStore } from "./stores/websocket";
import { useFollowersStore } from "./stores/followers";
import { useShallow } from "zustand/react/shallow";
import { toast } from "react-toastify";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const credentials = useCrendentialsStore();
  const setWs = useWebSocketStore((store) => store.setWs);
  const [getFollowers, followerError] = useFollowersStore(
    useShallow((store) => [store.getFollowers, store.error])
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getCredentials = useCallback(
    (loginName: string | null, token: string | null) => {
      if (credentials.info) {
        return;
      }

      if (!loginName || !token) {
        navigate("/");
      } else {
        const creds: Credentials = {
          login: loginName,
          token,
        };
        credentials.setInfo(creds);
      }
    },
    [credentials, navigate]
  );

  useEffect(() => {
    const loginName = searchParams.get("loginName");
    const accessToken = searchParams.get("access_token");
    getCredentials(loginName, accessToken);
  }, [searchParams, getCredentials]);

  useEffect(() => {
    let followerTimer: number | undefined;
    if (!followerError && credentials.info) {
      getFollowers();
      setWs();
      if (followerTimer) clearInterval(followerTimer);
      followerTimer = setInterval(getFollowers, 10 * 60000);
    }
    return function () {
      if (followerTimer) {
        clearInterval(followerTimer);
      }
    };
  }, [credentials, getFollowers, setWs, followerError]);

  useEffect(() => {
    if (followerError) {
      switch (followerError.status) {
        case 401:
          navigate("/");
      }
      toast(followerError.message);
    }
  }, [followerError, navigate]);

  return (
    <div className="h-full w-full flex">
      <Nav />
      <IRCView />
    </div>
  );
}
