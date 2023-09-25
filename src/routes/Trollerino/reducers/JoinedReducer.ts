import { Channel } from "@src/twitchChat/channel";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { Action } from ".";
import { TwitchStream } from "@src/helix/types/liveFollowers";

export type JoinedValue = {
  streamInfo: TwitchStream;
  channel: Channel;
  messages: IrcMessage[];
};

type JoinedReducerState = Map<string, JoinedValue>;

export const InitialJoinState: JoinedReducerState = new Map();

export const ADD_CHANNEL_AND_STREAM = Symbol();
export const DELETE_CHANNEL_AND_STREAM = Symbol();
export const ADD_MESSAGE = Symbol();

export function JoinedReducer(
  state: JoinedReducerState,
  { payload, type }: Action
): JoinedReducerState {
  switch (type) {
    case ADD_CHANNEL_AND_STREAM:
      return new Map(state).set(payload.channelName, payload.joinedValue);
    case DELETE_CHANNEL_AND_STREAM:
      state.delete(payload.channelName);
      return new Map(state);
    case ADD_MESSAGE:
      const joinedChan = state.get(payload.channelName);
      if (joinedChan) {
        joinedChan.messages.push(payload.message);
        return new Map(state);
      }
      return state;
    default:
      return state;
  }
}
