import { Suspense, useEffect, useState } from "react";
import { Followers } from "./components/Followers/index";
import { IRCView } from "./components/IRCView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { credentialsState } from "./atoms/credentials";
import { ircSocketState } from "./selectors/twitchChat";
import { msgParcer } from "@src/twitchChat/parser";
import { messagesState } from "./atoms/messages";

export type TwitchCredentials = {
  loginName: string;
  token: string;
};
const MAX_MSG_LEN = 150;

export default function Trollerino() {
  const [creds, setCreds] = useRecoilState(credentialsState);
  const [, setMessages] = useRecoilState(messagesState);
  const ws = useRecoilValue(ircSocketState);
  const [, setIsAuthenticated] = useState(false);

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
      const { channel } = parsedMsg;
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
        case "PRIVMSG":
          setMessages((currMsgs) => {
            let messages = currMsgs.get(channel) ?? [];
            if (messages.length >= MAX_MSG_LEN) {
              messages = messages.slice(0, MAX_MSG_LEN);
            }
            return new Map(currMsgs).set(channel, [...messages, parsedMsg]);
          });
          break;
        default:
          console.log(`Unhandled command: ${parsedMsg.command}`, { parsedMsg });
      }
    };

    return function () {
      if (ws) {
        ws.close();
      }
    };
  }, [ws, credentialsState]);

  return (
    <div className="h-full w-full flex">
      <Suspense fallback={<span>Loading followers...</span>}>
        <Followers />
      </Suspense>
      <IRCView />
      {/* <TwitchProvider token={creds.token} loginName={creds.loginName}>
        </TwitchProvider> */}
    </div>
  );
}
