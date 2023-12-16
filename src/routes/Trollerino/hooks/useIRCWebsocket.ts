import { useCallback, useEffect } from "react";
import { msgParcer } from "@src/twitchChat/parser";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { TwitchCredentials } from "..";
import { useCrendentialsStore } from "../stores/credentials";
import { useJoinedStore } from "../stores/joined";
import { useWebSocketStore } from "../stores/websocket";

export type TwitchConnect = (creds: TwitchCredentials) => Promise<WebSocket>;

export const useIRCWebsocket = () => {
  const { ws, setWs } = useWebSocketStore();
  const info = useCrendentialsStore((store) => store.info);
  const addMessage = useJoinedStore((store) => store.addMessage);

  const setListeners = useCallback(() => {
    if (!ws || !info) {
      return;
    }
    ws.onopen = () => {
      ws.send(
        "CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands"
      );
      ws.send(`PASS oauth:${info.token}`);
      ws.send(`NICK ${info.login}`);
    };

    ws.onmessage = (msg) => {
      const parsedMsg = msgParcer(msg.data, info.login);
      if (!parsedMsg) {
        return;
      }
      switch (parsedMsg.command) {
        case "001":
          //successfully authenticated & connected
          ws.send(
            "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
          );
          break;
        case "PING":
          ws.send("PONG :tmi.twitch.tv");
          break;
        case "PRIVMSG":
          addMessage(parsedMsg);
          break;
        case "NOTICE":
          if (parsedMsg.raw.includes("failed")) {
            console.log("ws failed... closing");
            ws.close();
            setWs(null);
            console.error(parsedMsg.raw);
          }
          break;
      }
    };
  }, [ws, info, addMessage]);

  useEffect(() => {
    if (!ws) {
      setWs(new WebSocket(SecureIrcUrl));
    }
  }, [ws, setWs]);

  useEffect(() => {
    setListeners();
  }, [setListeners]);

  return {
    ws,
  };
};
