import { useCallback, useEffect, useMemo } from "react";
import { useJoined } from "./useJoined";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChannelNameState } from "../atoms/activeChannelName";
import { createIRCMessage } from "../utils/createIrcMessage";
import { credentialsState } from "../atoms/credentials";
import { ircSocketState } from "../atoms/ircSocket";

export const useActiveChannel = () => {
  const [activeChannelName, _setActiveChannelName] = useRecoilState(
    activeChannelNameState
  );
  const ws = useRecoilValue(ircSocketState);
  const creds = useRecoilValue(credentialsState);

  const { joined, addMsg, setPaused } = useJoined();

  const activeChannel = useMemo(() => {
    if (!activeChannelName) {
      return null;
    }
    return joined.get(activeChannelName);
  }, [activeChannelName, joined]);

  useEffect(() => {
    if (!activeChannel && joined.size) {
      const { channelName } = Array.from(joined.values())[0];
      _setActiveChannelName(channelName);
    }
  }, [activeChannel, joined]);

  const send = useCallback(
    (msg: string) => {
      if (ws && creds && activeChannel) {
        ws.send(`PRIVMSG ${activeChannel?.channelName} :${msg}`);
        // Need to manually add own user message. Not sure how to do this via IRC events
        const ircMsg = createIRCMessage({
          username: creds.loginName,
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

  const setActiveChannel = (channelName: string) =>
    _setActiveChannelName(channelName);

  const pause = useCallback(() => {
    if (activeChannelName) {
      setPaused(true, activeChannelName);
    }
  }, [activeChannelName, setPaused]);

  const unpause = useCallback(() => {
    if (activeChannelName) {
      setPaused(false, activeChannelName);
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
