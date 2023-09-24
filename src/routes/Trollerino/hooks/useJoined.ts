import { useReducer } from "react";
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
} from "../reducers/JoinedReducer";

export type JoinedTwitchStream = TwitchStream & {
  messages: IrcMessage[];
  channelName: string;
};

export type UseJoined = ReturnType<typeof useJoined>;

export const useJoined = (chatAPI: TwitchChat | null) => {
  const [{ channels, streams, messages }, dispatch] = useReducer(
    JoinedReducer,
    InitialJoinState
  );

  // streams is an array due to the broadcast all feature
  const joinChannels = (streams: TwitchStream[]) => {
    if (!chatAPI) {
      throw new Error("Twitch Chat has not been set");
    }
    for (const stream of streams) {
      const channelName = getChannelName(stream.user_login);

      if (channels.has(channelName)) {
        continue;
      }
      const [channel] = chatAPI.joinChannel(stream.user_login);

      dispatch({
        type: ADD_CHANNEL_AND_STREAM,
        payload: {
          channelName: channel.channelName,
          channel,
          stream: Object.assign(stream, {
            messages: [],
            channelName: channel.channelName,
          }),
        },
      });
    }
  };

  const partChannel = (channelName: string) => {
    if (!chatAPI) {
      throw new Error("Twitch Chat has not been set");
    }
    const channel = channels.get(channelName);
    if (channel) {
      channel.part();
    }
    dispatch({ type: DELETE_CHANNEL_AND_STREAM, payload: { channelName } });
  };

  const checkIfJoined = (channelName: string) => {
    channelName = getChannelName(channelName);

    return channels.has(channelName);
  };

  const addMessage = (channelName: string, message: IrcMessage) => {
    dispatch({
      type: ADD_MESSAGE,
      payload: { channelName, message },
    });
  };
  return {
    checkIfJoined,
    partChannel,
    joinChannels,
    channels,
    streams,
    addMessage,
    messages,
  };
};
