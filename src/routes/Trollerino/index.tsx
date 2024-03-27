import { useCallback, useEffect } from "react";
import { Nav } from "./components/Nav";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Credentials, useCrendentialsStore } from "./stores/credentials";
import { useFollowersStore } from "./stores/followers";
import { toast } from "react-toastify";
import { JoinedTabs } from "./components/JoinedTabs";
import { ChatBox } from "./components/Chatbox";
import { TwitchStream } from "./components/TwitchStream";
import { useWebSocket } from "./hooks/useWebSocket";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const credentials = useCrendentialsStore();
  const { error: followerError, getFollowers } = useFollowersStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useWebSocket();

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
      if (followerTimer) clearInterval(followerTimer);
      followerTimer = setInterval(getFollowers, 10 * 60000);
    }
    return function () {
      if (followerTimer) {
        clearInterval(followerTimer);
      }
    };
  }, [credentials, getFollowers, followerError]);

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
      <div className="w-full h-screen flex flex-col overflow-hidden">
        <JoinedTabs />
        <TwitchStream />
        <ChatBox />
      </div>
    </div>
  );
}
