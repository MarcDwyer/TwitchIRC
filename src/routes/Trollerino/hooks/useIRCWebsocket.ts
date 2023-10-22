import { useRecoilState } from "recoil";
import { useCallback, useEffect } from "react";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoined } from "./useJoined";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { ircSocketState } from "../atoms/ircSocket";
import { TwitchCredentials } from "..";

export type TwitchConnect = (creds: TwitchCredentials) => Promise<WebSocket>;

export const useIRCWebsocket = () => {
  const { addMsg } = useJoined();
  const [websocket, setWs] = useRecoilState(ircSocketState);

  const connect = useCallback(
    (creds: TwitchCredentials) => {
      const ws = new WebSocket(SecureIrcUrl);
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
        console.log({ parsedMsg });
        switch (parsedMsg.command) {
          case "001":
            //successfully authenticated & connected
            ws.send(
              "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
            );
            setWs(ws);
            break;
          case "PING":
            ws.send("PONG :tmi.twitch.tv");
            break;
          case "PRIVMSG":
            addMsg(parsedMsg);
            break;
          case "NOTICE":
            if (parsedMsg.raw.includes("failed")) {
              ws.close();
              setWs(null);
              console.error(parsedMsg.raw);
            }
            break;
        }
      };
    },
    [setWs, addMsg]
  );

  useEffect(() => {
    return function () {
      if (websocket) {
        console.log("CLOSING");
        websocket.close();
      }
    };
  }, [websocket]);

  return {
    websocket,
    connect,
  };
};
