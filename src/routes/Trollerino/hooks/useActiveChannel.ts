import { useEffect, useMemo, useState } from "react";
import { UseJoined } from "./useJoined";

export const useActiveChannel = (joined: UseJoined) => {
  const [channelName, setChannelName] = useState<null | string>(null);

  const activeChannel = useMemo(() => {
    if (!channelName) {
      return null;
    }
    return joined.channels.get(channelName);
  }, [joined.channels, channelName]);

  const activeMessages = useMemo(() => {
    if (!channelName) {
      return [];
    }
    return joined.messages.get(channelName) ?? [];
  }, [joined.messages, channelName]);

  useEffect(() => {
    if (activeChannel) {
      activeChannel.addEventListener("privmsg", (msg) => {
        joined.addMessage(activeChannel.channelName, msg);
      });
      activeChannel.addEventListener("userstate", (msg) => {
        // joined.addMessage(activeChannel.channelName, msg);
        console.log(msg.message);
      });
    }

    return () => {
      if (activeChannel) {
        activeChannel.removeEventListener("privmsg");
        activeChannel.removeEventListener("userstate");
      }
    };
  }, [activeChannel]);

  useEffect(() => {
    if (!activeChannel && joined.streams.size) {
      const { channelName } = Array.from(joined.streams.values())[0];
      setChannelName(channelName);
    }
  }, [activeChannel, joined.streams, setChannelName]);

  return {
    activeChannel,
    setChannelName,
    activeMessages,
  };
};
