import { TwitchStream } from "@src/helix/types/liveFollowers";
import { JoinedValue } from "../reducers/JoinedReducer";
import { Channel } from "@src/twitchChat/channel";

export const createJoinedValue = (
  stream: TwitchStream,
  channel: Channel
): JoinedValue => ({
  streamInfo: stream,
  channel,
  keyName: stream.user_login,
  messages: [],
  mentioned: false,
});
