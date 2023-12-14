import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect } from "react";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoined } from "./useJoined";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { ircSocketState } from "../atoms/ircSocket";
import { TwitchCredentials } from "..";
import { credentialsState } from "../atoms/credentials";

export type TwitchConnect = (creds: TwitchCredentials) => Promise<WebSocket>;

export const useIRCWebsocket = () => {
  const { addMsg } = useJoined();
  const [websocket, setWs] = useRecoilState(ircSocketState);
  const creds = useRecoilValue(credentialsState);

  const setListeners = useCallback(() => {
    if (!websocket || !creds) {
      return;
    }
    websocket.onopen = () => {
      websocket.send(
        "CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands"
      );
      websocket.send(`PASS oauth:${creds.token}`);
      websocket.send(`NICK ${creds.loginName}`);
    };

    websocket.onmessage = (msg) => {
      const parsedMsg = msgParcer(msg.data, creds.loginName);
      if (!parsedMsg) {
        return;
      }
      switch (parsedMsg.command) {
        case "001":
          //successfully authenticated & connected
          websocket.send(
            "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
          );
          break;
        case "PING":
          websocket.send("PONG :tmi.twitch.tv");
          break;
        case "PRIVMSG":
          addMsg(parsedMsg);
          break;
        case "NOTICE":
          if (parsedMsg.raw.includes("failed")) {
            console.log("Websocket failed... closing");
            websocket.close();
            setWs(null);
            console.error(parsedMsg.raw);
          }
          break;
      }
    };
  }, [websocket, creds, addMsg]);

  useEffect(() => {
    if (!websocket) {
      setWs(new WebSocket(SecureIrcUrl));
    }
  }, [websocket, setWs]);

  useEffect(() => {
    setListeners();
  }, [setListeners]);

  return {
    websocket,
  };
};
