import { useCallback, useEffect, useMemo } from "react";
import { useJoined } from "./useJoined";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChannelNameState } from "../atoms/activeChannelName";
import { createIRCMessage } from "../utils/createIrcMessage";
import { credentialsState } from "../atoms/credentials";
import { ircSocketState } from "../atoms/ircSocket";

export const useActiveChannel = () => {
  const [activeChannelName, setActiveChannelName] = useRecoilState(
    activeChannelNameState
  );
  const ws = useRecoilValue(ircSocketState);
  const creds = useRecoilValue(credentialsState);

  const { joined, addMsg } = useJoined();

  const activeChannel = useMemo(() => {
    if (!activeChannelName) {
      return null;
    }
    return joined.get(activeChannelName);
  }, [activeChannelName, joined]);

  useEffect(() => {
    if (!activeChannel && joined.size) {
      const { channelName } = Array.from(joined.values())[0];
      setActiveChannelName(channelName);
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
  return {
    setActiveChannelName,
    activeChannel,
    addMsg,
    send,
    linkToStream,
  };
};
