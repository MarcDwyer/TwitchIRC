import { useRecoilState, useRecoilValue } from "recoil";
import { createJoinedAtomVal, joinedState } from "../atoms/joined";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { useCallback } from "react";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { ircSocketState } from "../atoms/ircSocket";

const MAX_MSG_LEN = 150;

export const useJoined = () => {
  const [joined, setJoined] = useRecoilState(joinedState);
  const ws = useRecoilValue(ircSocketState);

  const join = useCallback(
    (stream: TwitchStream) => {
      let channelName = stream.user_login;
      if (channelName[0] !== "#") {
        channelName = "#" + channelName;
      }
      if (!ws) {
        return;
      }
      console.log({ channelName });
      ws.send(`JOIN ${channelName}`);
      const newlyJoined = createJoinedAtomVal(channelName, stream);

      setJoined(new Map(joined).set(channelName, newlyJoined));
      return newlyJoined;
    },
    [ws, setJoined, joined]
  );

  const part = useCallback(
    (channelName: string) => {
      if (!ws) {
        return;
      }
      ws.send(`PART ${channelName}`);
      const updatedJoined = new Map(joined);
      updatedJoined.delete(channelName);
      setJoined(updatedJoined);
    },
    [setJoined, joined]
  );

  const addMsg = useCallback(
    (msg: IrcMessage) => {
      const channel = joined.get(msg.channel);
      console.log({ channel, msg, joined });
      if (channel) {
        let msgs = [...channel.messages, msg];
        if (msgs.length >= MAX_MSG_LEN) {
          msgs = msgs.slice(1, msgs.length);
        }
        setJoined(
          new Map(joined).set(msg.channel, { ...channel, messages: msgs })
        );
      }
    },
    [joined, setJoined]
  );
  return {
    join,
    part,
    joined,
    addMsg,
  };
};
