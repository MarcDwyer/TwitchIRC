import { useRecoilState, useRecoilValue } from "recoil";
import { createJoinedAtomVal, joinedState } from "../atoms/joined";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { useCallback } from "react";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { ircSocketState } from "../atoms/ircSocket";
import { useFollowers } from "./useFollowers";
import { createIRCMessage } from "../utils/createIrcMessage";
import { credentialsState } from "../atoms/credentials";
import { createChannelName } from "../utils/createChannelName";
import { isMentioned } from "../utils/isMentioned";
import { TwitchCmds } from "../utils/twitchCmds";

const MAX_MSG_LEN = 350;

export const useJoined = () => {
  const [joined, setJoined] = useRecoilState(joinedState);
  const ws = useRecoilValue(ircSocketState);
  const creds = useRecoilValue(credentialsState);
  const { followers } = useFollowers();

  const join = useCallback(
    (stream: TwitchStream) => {
      const channelName = createChannelName(stream.user_login);
      if (joined.has(channelName)) {
        return joined.get(channelName);
      }
      if (!ws) {
        return;
      }
      ws.send(`JOIN ${channelName}`);
      const newlyJoined = createJoinedAtomVal(channelName, stream);

      const newJoined = new Map(joined).set(channelName, newlyJoined);
      setJoined(newJoined);
      return newlyJoined;
    },
    [ws, setJoined, joined]
  );
  const part = useCallback(
    (channelName: string) => {
      if (!ws) {
        return;
      }
      ws.send(TwitchCmds.part(channelName));
      const updatedJoined = new Map(joined);
      updatedJoined.delete(channelName);
      setJoined(updatedJoined);
    },
    [setJoined, joined]
  );

  const addMsg = useCallback(
    (msg: IrcMessage) => {
      const channel = joined.get(msg.channel);
      if (channel && !channel.paused) {
        let msgs = [...channel.messages, msg];
        if (msgs.length >= MAX_MSG_LEN) {
          msgs = msgs.slice(1, msgs.length);
        }
        const mentioned = isMentioned(creds?.loginName as string, msg.message);
        setJoined(
          new Map(joined).set(msg.channel, {
            ...channel,
            messages: msgs,
            mentioned,
          })
        );
      }
    },
    [joined, setJoined, creds]
  );
  const setPaused = useCallback(
    (paused: boolean, channelName: string) => {
      const channel = joined.get(channelName);
      if (channel) {
        const updatedChannel = { ...channel, paused };
        setJoined(new Map(joined).set(channelName, updatedChannel));
      }
    },
    [joined, setJoined]
  );
  const bulkJoin = useCallback(
    (streams: TwitchStream[]) => {
      const newJoined = new Map(joined);

      for (const stream of streams) {
        const channelName = createChannelName(stream.user_login);

        if (!newJoined.has(channelName) && ws) {
          ws.send(TwitchCmds.join(channelName));
          newJoined.set(channelName, createJoinedAtomVal(channelName, stream));
        }
      }
      return newJoined;
    },
    [joined, ws]
  );

  const broadcast = useCallback(
    (message: string) => {
      if (!followers || !ws || !creds) {
        return;
      }
      const updatedJoined = bulkJoin(followers);
      for (const [channelName, joinedChan] of updatedJoined.entries()) {
        const ircMsg = createIRCMessage({
          username: creds.loginName,
          message,
          channelName,
        });
        joinedChan.messages.push(ircMsg);

        ws.send(TwitchCmds.send(channelName, message));
      }
      setJoined(updatedJoined);
    },
    [bulkJoin, creds, ws, followers]
  );

  const resetMentioned = useCallback(
    (channelName: string) => {
      const updatedJoined = new Map(joined);
      const channel = updatedJoined.get(channelName);
      if (channel) {
        updatedJoined.set(channelName, { ...channel, mentioned: false });
        setJoined(updatedJoined);
      }
    },
    [joined]
  );

  return {
    resetMentioned,
    setPaused,
    join,
    part,
    joined,
    addMsg,
    setJoined,
    broadcast,
  };
};
