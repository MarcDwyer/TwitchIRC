import { create } from "zustand";
import { useCrendentialsStore } from "./credentials";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";
import { useChatStore } from "./chat";
import { isMentioned } from "../utils/isMentioned";
import { useJoinedStore } from "./joined";
import { msgParcer } from "@src/twitchChat/parser";
import { TwitchCmds } from "../utils/twitchCmds";

export type WebSocketStoreState = {
  ws: WebSocket | null;
  connected: boolean;
  setWs: () => void;
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ws: null,
  connected: false,
  setWs: () => {
    const info = useCrendentialsStore.getState().info;
    if (!info) return;
    const ws = new WebSocket(SecureIrcUrl);
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
          set({ connected: true, ws });
          // connect ws to rooms currently joined
          const joined = useJoinedStore.getState().joined;
          if (joined.size) {
            for (const channelName of joined.keys()) {
              ws.send(TwitchCmds.join(channelName));
            }
          }
          break;
        case "PING":
          ws.send("PONG :tmi.twitch.tv");
          break;
        case "PRIVMSG": {
          const addMessage = useChatStore.getState().addMessage;
          const mentioned = isMentioned(info.login, parsedMsg.message);
          if (mentioned) {
            const setMentioned = useJoinedStore.getState().setMentioned;
            setMentioned(parsedMsg.channel, true);
          }
          Object.assign(parsedMsg, { mentioned });
          addMessage(parsedMsg);
          break;
        }
        case "USERSTATE":
          break;
        case "NOTICE":
          if (parsedMsg.raw.includes("failed")) {
            console.log("ws failed... closing");
            ws.close();
          }
          break;
      }
    };
    ws.onerror = console.error;

    ws.onclose = () => set({ connected: false, ws: null });
  },
}));
