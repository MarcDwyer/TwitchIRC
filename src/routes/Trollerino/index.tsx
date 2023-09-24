import { useEffect, useState } from "react";
import { TwitchProvider } from "./context/twitchCtx";
import { Followers } from "./components/Followers/index";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};
export default function Trollerino() {
  const [creds, setCreds] = useState<TwitchCredentials | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const loginName = searchParams.get("loginName");

    if (accessToken && loginName) {
      setCreds({
        loginName,
        token: accessToken,
      });
    } else {
      navigate("/");
    }
  }, [searchParams]);

  return (
    <div className="h-full w-full flex">
      {creds && (
        <TwitchProvider token={creds.token} loginName={creds.loginName}>
          <Followers />
          <IRCView />
        </TwitchProvider>
      )}
    </div>
  );
}
