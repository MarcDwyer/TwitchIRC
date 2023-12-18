import { create } from "zustand";
import { Credentials, useCrendentialsStore } from "./credentials";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoinedStore } from "./joined";
import { SecureIrcUrl } from "@src/twitchChat/twitch_data";

export type WebSocketStoreState = {
  ws: WebSocket | null;
  connected: boolean;
  setWs: (info: Credentials) => void;
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ws: null,
  connected: false,
  setWs: (info) => {
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
          break;
        case "PING":
          ws.send("PONG :tmi.twitch.tv");
          break;
        case "PRIVMSG":
          const addMessage = useJoinedStore.getState().addMessage;
          addMessage(parsedMsg);
          break;
        case "NOTICE":
          if (parsedMsg.raw.includes("failed")) {
            console.log("ws failed... closing");
            ws.close();
            set({ connected: false });
            console.error(parsedMsg.raw);
          }
          break;
      }
    };
    ws.onclose = () => set({ connected: false });
  },
}));
