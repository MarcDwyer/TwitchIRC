import { TwitchStream } from "@src/helix/types/liveFollowers";
import { JoinedMap } from "../stores/joined";
import { createChannelName } from "./createChannelName";
import { createJoinedAtomVal } from "../atoms/joined";

export function bulkJoin(streams: TwitchStream[], joined: JoinedMap) {
  const newJoined = new Map(joined);

  for (const stream of streams) {
    const channelName = createChannelName(stream.user_login);

    if (!newJoined.has(channelName)) {
      newJoined.set(channelName, createJoinedAtomVal(channelName, stream));
    }
  }
  return newJoined;
}
