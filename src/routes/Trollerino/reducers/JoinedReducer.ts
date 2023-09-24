import { Channel } from "@/twitchChat/channel";
import { JoinedTwitchStream } from "../hooks/useJoined";
import { Action } from ".";
import { IrcMessage } from "@/twitchChat/twitch_data";

type JoinedReducerState = {
  streams: Map<string, JoinedTwitchStream>;
  channels: Map<string, Channel>;
  messages: Map<string, IrcMessage[]>;
};

export const InitialJoinState: JoinedReducerState = {
  streams: new Map(),
  channels: new Map(),
  messages: new Map(),
};

export const ADD_CHANNEL_AND_STREAM = Symbol();
export const DELETE_CHANNEL_AND_STREAM = Symbol();
export const ADD_MESSAGE = Symbol();

export function JoinedReducer(
  state: JoinedReducerState,
  { payload, type }: Action
): JoinedReducerState {
  switch (type) {
    case ADD_CHANNEL_AND_STREAM:
      return {
        ...state,
        streams: new Map(state.streams).set(
          payload.channelName,
          payload.stream
        ),
        channels: new Map(state.channels).set(
          payload.channelName,
          payload.channel
        ),
      };
    case DELETE_CHANNEL_AND_STREAM:
      state.streams.delete(payload.channelName);
      state.channels.delete(payload.channelName);
      state.messages.delete(payload.channelName);
      return {
        ...state,
        streams: new Map(state.streams),
        channels: new Map(state.channels),
        messages: new Map(state.messages),
      };
    case ADD_MESSAGE:
      const ircMsgs = state.messages.get(payload.channelName) ?? [];
      ircMsgs.push(payload.message);
      return {
        ...state,
        messages: new Map(state.messages).set(payload.channelName, [
          ...ircMsgs,
        ]),
      };
    default:
      return state;
  }
}
