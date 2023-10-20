import { Suspense, useEffect } from "react";
import { Followers } from "./components/Followers/index";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { credentialsState } from "./atoms/credentials";
import { useIRCWebsocket } from "./hooks/useIRCWebsocket";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const [, setCreds] = useRecoilState(credentialsState);

  useIRCWebsocket();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const loginName = searchParams.get("loginName");

    if (accessToken && loginName) {
      const creds: TwitchCredentials = {
        loginName,
        token: accessToken,
      };
      setCreds(creds);
    } else {
      navigate("/");
    }
  }, [searchParams, setCreds, setCreds]);

  return (
    <div className="h-full w-full flex">
      <Suspense fallback={<span>Loading followers...</span>}>
        <Followers />
        <IRCView />
      </Suspense>
    </div>
  );
}
