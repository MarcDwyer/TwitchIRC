import { useWebSocketStore } from "../stores/websocket";

export function ConnectAgain() {
  const { connected, ws, setWs } = useWebSocketStore();
  return (
    <>
      {ws && !connected && (
        <button
          onClick={setWs}
          className="mt-auto w-full border-gray-500b bg-red-800 h-20 flex cursor-pointer background"
        >
          <span className="m-auto">Connection error... Click to try again</span>
        </button>
      )}
    </>
  );
}
