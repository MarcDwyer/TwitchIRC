import { useEffect } from "react";
import { useCrendentialsStore } from "../stores/credentials";
import { useWebSocketStore } from "../stores/websocket";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoinedStore } from "../stores/joined";
import { TwitchCmds } from "../utils/twitchCmds";
import { isMentioned } from "../utils/isMentioned";
import { useChatStore } from "../stores/chat";

// a hook designed to orchestrate websocket events
export function useWebSocket() {
  const creds = useCrendentialsStore((store) => store.info);
  const { ws: stateWs, setWs, clearWs } = useWebSocketStore();

  const addMsgToCache = useChatStore((store) => store.addMessage);

  useEffect(() => {
    if (!creds) return;

    const ws = stateWs ?? new WebSocket(SecureIrcUrl);
    ws.onopen = () => {
      ws.send(
        "CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands"
      );
      ws.send(`PASS oauth:${creds.token}`);
      ws.send(`NICK ${creds.login}`);
    };
    ws.onmessage = (msg) => {
      const parsedMsg = msgParcer(msg.data, creds.login);

      if (!parsedMsg) {
        return;
      }
      switch (parsedMsg.command) {
        case "001":
          //successfully authenticated & connected
          ws.send(
            "CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"
          );
          // connect ws to rooms currently joined
          const joined = useJoinedStore.getState().joined;
          if (joined.size) {
            for (const channelName of joined.keys()) {
              ws.send(TwitchCmds.join(channelName));
            }
          }
          setWs(ws);
          break;
        case "PING":
          ws.send("PONG :tmi.twitch.tv");
          break;
        case "PRIVMSG": {
          const mentioned = isMentioned(creds.login, parsedMsg.message);
          if (mentioned) {
            const setMentioned = useJoinedStore.getState().setMentioned;
            setMentioned(parsedMsg.channel, true);
          }
          Object.assign(parsedMsg, { mentioned });
          addMsgToCache(parsedMsg);
          break;
        }
        case "USERSTATE":
          break;
        case "NOTICE":
          if (parsedMsg.raw.includes("failed")) {
            console.log("ws failed... closing");
            ws.close();
            clearWs();
          }
          break;
      }
    };
    ws.onerror = console.error;
  }, [creds, setWs, stateWs, clearWs]);
}
