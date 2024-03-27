import { create } from "zustand";

export type WebSocketStoreState = {
  ws: WebSocket | null;
  connected: boolean;
  setWs: (ws: WebSocket) => void;
  clearWs: () => void;
};

export const useWebSocketStore = create<WebSocketStoreState>((set) => ({
  ws: null,
  connected: false,
  setWs: (ws: WebSocket) => {
    set({ ws, connected: true });
  },
  clearWs: () => set({ ws: null, connected: false }),
}));
