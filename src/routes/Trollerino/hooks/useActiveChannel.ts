import { useCallback, useEffect, useMemo } from "react";
import { useJoined } from "./useJoined";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useActiveChannelStore } from "../stores/activeChannel";
import { useWebSocketStore } from "../stores/websocket";
import { useCrendentialsStore } from "../stores/credentials";
import { useShallow } from "zustand/react/shallow";
import { useJoinedStore } from "../stores/joined";

export const useActiveChannel = () => {
  const [activeChannelName, setActiveChannel] = useActiveChannelStore(
    (store) => [store.channelName, store.setActiveChannel]
  );
  const ws = useWebSocketStore((store) => store.ws);
  const creds = useCrendentialsStore((store) => store.info);

  const { joined, addMsg, setPaused } = useJoinedStore(
    useShallow((store) => ({
      joined: store.joined,
      addMsg: store.addMessage,
      setPaused: store.setPaused,
    }))
  );

  const activeChannel = useMemo(() => {
    if (!activeChannelName) {
      return null;
    }
    return joined.get(activeChannelName);
  }, [activeChannelName, joined]);

  console.log({ activeChannel });
  useEffect(() => {
    if (!activeChannel && joined.size) {
      const { channelName } = Array.from(joined.values())[0];
      setActiveChannel(channelName);
    }
  }, [activeChannel, joined]);

  const send = useCallback(
    (msg: string) => {
      if (ws && creds && activeChannel) {
        ws.send(`PRIVMSG ${activeChannel?.channelName} :${msg}`);
        // Need to manually add own user message. Not sure how to do this via IRC events
        const ircMsg = createIRCMessage({
          username: creds.login,
          message: msg,
          channelName: activeChannel?.channelName,
        });
        addMsg(ircMsg);
      }
    },
    [activeChannel, ws, creds, addMsg]
  );

  const linkToStream = useMemo(() => {
    if (!activeChannel) {
      return null;
    }
    const link = "https://twitch.tv/" + activeChannel.streamData.user_name;
    return link;
  }, [activeChannel]);

  const pause = useCallback(() => {
    if (activeChannelName) {
      setPaused(activeChannelName, true);
    }
  }, [activeChannelName, setPaused]);

  const unpause = useCallback(() => {
    if (activeChannelName) {
      setPaused(activeChannelName, false);
    }
  }, [activeChannelName, setPaused]);

  return {
    pause,
    unpause,
    setActiveChannel,
    activeChannel,
    addMsg,
    send,
    linkToStream,
  };
};
