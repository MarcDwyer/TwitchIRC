import { useEffect, useMemo, useState } from "react";
import { UseJoined } from "./useJoined";

export const useActiveChannel = (joined: UseJoined) => {
  const [channelName, setChannelName] = useState<null | string>(null);

  const activeChannel = useMemo(() => {
    if (!channelName) {
      return null;
    }
    return joined.streams.get(channelName);
  }, [joined.streams, channelName]);

  useEffect(() => {
    if (activeChannel) {
      console.log(`Setting ${activeChannel.channel.channelName} listeners...`);
      activeChannel.channel.addEventListener("privmsg", (msg) => {
        joined.addMessage(activeChannel.channel.channelName, msg);
      });
      activeChannel.channel.addEventListener("userstate", (msg) => {
        // joined.addMessage(activeChannel.channelName, msg);
        console.log(msg.message);
      });
    }

    return () => {
      if (activeChannel) {
        console.log(
          `Removing ${activeChannel.channel.channelName} listeners...`
        );
        activeChannel.channel.removeEventListener("privmsg");
        activeChannel.channel.removeEventListener("userstate");
      }
    };
  }, [activeChannel]);

  useEffect(() => {
    if (!activeChannel && joined.streams.size) {
      const { channelName } = Array.from(joined.streams.values())[0].channel;
      setChannelName(channelName);
    }
  }, [activeChannel, joined.streams, setChannelName]);

  return {
    activeChannel,
    setChannelName,
  };
};
