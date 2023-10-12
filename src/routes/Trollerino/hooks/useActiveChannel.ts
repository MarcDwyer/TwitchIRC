import { useCallback, useEffect, useMemo } from "react";
import { useJoined } from "./useJoined";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChannelNameState } from "../atoms/activeChannelName";
import { ircSocketState } from "../selectors/twitchChat";
import { createIRCMessage } from "../utils/createIrcMessage";
import { credentialsState } from "../atoms/credentials";

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

  return {
    setActiveChannelName,
    activeChannel,
    addMsg,
    send,
  };
};
