import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";
import { credentialsState } from "../atoms/credentials";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoined } from "./useJoined";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { ircSocketState } from "../atoms/ircSocket";

export const useIRCWebsocket = () => {
  const creds = useRecoilValue(credentialsState);
  const { addMsg } = useJoined();
  const [websocket, setWs] = useRecoilState(ircSocketState);

  useEffect(() => {
    if (creds) {
      const ws = websocket ?? new WebSocket(SecureIrcUrl);
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
          default:
            console.log(`Unhandled command: ${parsedMsg.command}`, {
              parsedMsg,
            });
        }
      };
    }
  }, [setWs, addMsg, creds, websocket]);

  useEffect(() => {
    return function () {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  return websocket;
};
