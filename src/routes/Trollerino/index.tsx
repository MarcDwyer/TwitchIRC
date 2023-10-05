import { Suspense, useEffect, useState } from "react";
import { TwitchProvider } from "./context/twitchCtx";
import { Followers } from "./components/Followers/index";
import IRCView from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { credentialsState } from "./atoms/credentials";
import { ircSocketState } from "./selectors/twitchChat";
import { msgParcer } from "@src/twitchChat/parser";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};

export default function Trollerino() {
  const [creds, setCreds] = useRecoilState(credentialsState);
  const ws = useRecoilValue(ircSocketState);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    if (!ws || !creds) {
      return;
    }
    ws.onopen = () => {
      ws.send(
        "CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands"
      );
      ws.send(`PASS oauth:${creds.token}`);
      ws.send(`NICK ${creds.loginName}`);
    };

    ws.onmessage = (msg) => {
      const parsedMsg = msgParcer(msg.data, creds.loginName);
      if (!parsedMsg) {
        return;
      }

      switch (parsedMsg.command) {
        case "001":
          setIsAuthenticated(true);
          ws.send(
            "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
          );
          break;
        case "PING":
          ws.send("PONG :tmi.twitch.tv");
          break;
        default:
          console.log(`Unhandled command: ${parsedMsg.command}`, { parsedMsg });
      }
    };
  }, [ws, credentialsState]);

  return (
    <div className="h-full w-full flex">
      <Suspense fallback={<span>Loading followers...</span>}>
        <Followers />
      </Suspense>
      {/* <IRCView /> */}
      {/* <TwitchProvider token={creds.token} loginName={creds.loginName}>
        </TwitchProvider> */}
    </div>
  );
}
