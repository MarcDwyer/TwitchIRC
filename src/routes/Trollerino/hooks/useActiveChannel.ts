import { useCallback, useEffect, useMemo, useState } from "react";
import { UseJoined } from "./useJoined";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useTwitch } from "../context/twitchCtx";

export const useActiveChannel = (joined: UseJoined) => {
  const { loginName } = useTwitch();
  const [activeKeyName, setActiveKeyName] = useState<null | string>(null);

  const activeChannel = useMemo(() => {
    if (!activeKeyName) {
      return null;
    }
    return joined.streams.get(activeKeyName);
  }, [joined.streams, activeKeyName]);

  useEffect(() => {
    if (!activeChannel && joined.streams.size) {
      const streams = Array.from(joined.streams.values());
      const keyName = streams[streams.length - 1].keyName;
      setActiveKeyName(keyName);
    }
  }, [activeChannel, joined.streams, setActiveKeyName]);

  useEffect(() => {}, [activeChannel]);

  const send = useCallback(
    (message: string) => {
      if (!activeChannel) {
        return;
      }
      const ircMsg = createIRCMessage({
        username: loginName,
        message,
        channelName: activeChannel.channel.channelName,
      });
      activeChannel.channel.send(message);
      joined.addMessage(activeChannel.channel.channelName, ircMsg);
    },
    [activeChannel, loginName]
  );

  return {
    activeChannel,
    setActiveKeyName,
    activeKeyName,
    send,
  };
};
