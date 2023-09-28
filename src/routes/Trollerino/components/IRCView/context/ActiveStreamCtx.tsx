import { useTwitch } from "@src/routes/Trollerino/context/twitchCtx";
import { createIRCMessage } from "@src/routes/Trollerino/utils/createIrcMessage";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ActiveStreamState = {
  streamKey: string;
  setStreamKey: (streamKey: string) => void;
};
type ActiveStreamCtxProps = {
  children: React.ReactNode;
};
const ActiveStreamCtx = createContext<ActiveStreamState>({
  streamKey: "",
  setStreamKey: () => {},
});

export function ActiveStreamProvider({ children }: ActiveStreamCtxProps) {
  const [streamKey, setStreamKey] = useState("");

  return (
    <ActiveStreamCtx.Provider value={{ streamKey, setStreamKey }}>
      {children}
    </ActiveStreamCtx.Provider>
  );
}

export function useActiveStream() {
  const { joined } = useTwitch();
  const { streamKey } = useContext(ActiveStreamCtx);

  const activeStream = useMemo(() => {
    return joined.streams.get(streamKey);
  }, [joined.streams, streamKey]);

  return {
    ...useContext(ActiveStreamCtx),
    activeStream,
  };
}

export function useActiveStreamActions() {
  const { setStreamKey, activeStream } = useActiveStream();
  const { loginName, joined } = useTwitch();

  const sendMsg = useCallback(
    (message: string) => {
      if (!activeStream) {
        return;
      }
      const ircMsg = createIRCMessage({
        username: loginName,
        message,
        channelName: activeStream.channel.channelName,
      });
      activeStream.channel.send(message);
      joined.addMessage(activeStream.channel.channelName, ircMsg);
    },
    [activeStream, loginName, joined.addMessage]
  );

  return {
    setStreamKey,
    sendMsg,
  };
}
