import { useWebSocketStore } from "../stores/websocket";
import { useShallow } from "zustand/react/shallow";

export function ConnectAgain() {
  const [connected, ws] = useWebSocketStore(
    useShallow((store) => [store.connected, store.ws])
  );
  return (
    <>
      {ws && !connected && (
        <button className="mt-auto w-full border-gray-500b bg-red-800 h-20 flex cursor-pointer background">
          <span className="m-auto">Connection error... Click to try again</span>
        </button>
      )}
    </>
  );
}
