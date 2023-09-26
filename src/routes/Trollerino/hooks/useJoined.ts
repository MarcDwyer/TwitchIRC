import { useCallback, useReducer } from "react";
import { TwitchStream } from "@src/helix/types/liveFollowers";
import { TwitchChat } from "@src/twitchChat/twitch_chat";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { getChannelName } from "@src/twitchChat/util";
import {
  ADD_CHANNEL_AND_STREAM,
  ADD_MESSAGE,
  DELETE_CHANNEL_AND_STREAM,
  InitialJoinState,
  JoinedReducer,
  JoinedValue,
  SET_MENTIONED,
} from "../reducers/JoinedReducer";
import { Channel, ChannelEvents } from "@src/twitchChat/channel";
import { checkIfMentioned } from "../utils/checkIfMentioned";

export type UseJoined = ReturnType<typeof useJoined>;

const usedEvents: ChannelEvents[] = ["privmsg"];

const removeListeners = (channel: Channel, evts: ChannelEvents[]) => {
  for (const evt of evts) {
    channel.removeEventListener(evt);
  }
};

export const useJoined = (chatAPI: TwitchChat | null, loginName: string) => {
  const [streams, dispatch] = useReducer(JoinedReducer, InitialJoinState);

  const setMentioned = useCallback(
    (keyName: string, mentioned: boolean) => {
      dispatch({
        type: SET_MENTIONED,
        payload: { keyName, mentioned },
      });
    },
    [dispatch]
  );

  const addListeners = useCallback(
    ({ channel, keyName }: JoinedValue) => {
      channel.addEventListener("privmsg", (msg) => {
        if (checkIfMentioned(msg.message, loginName)) {
          setMentioned(keyName, true);
        }
        addMessage(keyName, msg);
      });
    },
    [dispatch, setMentioned]
  );
  // streams is an array due to the broadcast all feature
  const joinChannels = (twitchStreams: TwitchStream[]) => {
    if (!chatAPI) {
      throw new Error("Twitch Chat has not been set");
    }
    for (const stream of twitchStreams) {
      const channelName = getChannelName(stream.user_login);

      if (streams.has(channelName)) {
        continue;
      }
      const [channel] = chatAPI.joinChannel(stream.user_login);

      const joinedValue: JoinedValue = {
        channel,
        streamInfo: stream,
        messages: [],
        keyName: channelName,
        mentioned: false,
      };

      addListeners(joinedValue);

      dispatch({
        type: ADD_CHANNEL_AND_STREAM,
        payload: {
          channelName,
          joinedValue,
        },
      });
    }
  };

  const partChannel = (channelName: string) => {
    if (!chatAPI) {
      throw new Error("Twitch Chat has not been set");
    }
    const joinedStream = streams.get(channelName);
    if (joinedStream) {
      removeListeners(joinedStream.channel, usedEvents);
      joinedStream.channel.part();
    }
    dispatch({ type: DELETE_CHANNEL_AND_STREAM, payload: { channelName } });
  };

  const checkIfJoined = (channelName: string) => {
    channelName = getChannelName(channelName);

    return streams.has(channelName);
  };

  const addMessage = useCallback(
    (channelName: string, message: IrcMessage) => {
      dispatch({
        type: ADD_MESSAGE,
        payload: { channelName, message },
      });
    },
    [dispatch]
  );

  return {
    setMentioned,
    checkIfJoined,
    partChannel,
    joinChannels,
    addMessage,
    streams,
  };
};
