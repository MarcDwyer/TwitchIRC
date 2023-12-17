import { TwitchStream } from "@src/helix/types/liveFollowers";
import { JoinedMap, createJoinedAtomVal } from "../stores/joined";
import { createChannelName } from "./createChannelName";

export function bulkJoin(
  streams: TwitchStream[],
  joined: JoinedMap
): [JoinedMap, Set<string>] {
  const newJoined = new Map(joined);
  const notJoined = new Set<string>();
  for (const stream of streams) {
    const channelName = createChannelName(stream.user_login);

    if (!newJoined.has(channelName)) {
      newJoined.set(channelName, createJoinedAtomVal(channelName, stream));
      notJoined.add(channelName);
    }
  }
  return [newJoined, notJoined];
}
