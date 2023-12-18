import { create } from "zustand";
import { useCrendentialsStore } from "./credentials";
import { msgParcer } from "@src/twitchChat/parser";
import { useJoinedStore } from "./joined";

export type WebSocketStoreState = {
  ws: WebSocket | null;
  connected: boolean;
  setWs: (ws: WebSocket | null) => void;
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ws: null,
  connected: false,
  setWs: (ws) => {
    const info = useCrendentialsStore.getState().info;
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
          set({ connected: true });
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
