import { create } from "zustand";

export type WebSocketStoreState = {
  ws: WebSocket | null;
  setWs: (ws: WebSocket) => void;
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ws: null,
  setWs: (ws) => set({ ws }),
}));
