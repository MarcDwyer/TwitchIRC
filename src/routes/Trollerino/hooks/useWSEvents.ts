import { useRecoilValue } from "recoil";
import { useEffect } from "react";
import { credentialsState } from "../atoms/credentials";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoined } from "./useJoined";

export const useWSEvents = (ws: WebSocket | null) => {
  const creds = useRecoilValue(credentialsState);
  const { addMsg } = useJoined();

  useEffect(() => {
    if (ws) {
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
            ws.send(
              "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
            );
            break;
          case "PING":
            ws.send("PONG :tmi.twitch.tv");
            break;
          case "PRIVMSG":
            addMsg(parsedMsg);
            break;
          default:
            console.log(`Unhandled command: ${parsedMsg.command}`, {
              parsedMsg,
            });
        }
      };

      return function () {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [ws, addMsg]);
};
