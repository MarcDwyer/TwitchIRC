import {
  JoinedAtomValue,
  createJoinedAtomVal,
} from "@src/routes/Trollerino/atoms/joined";

const twitchStream = {
  id: "123456789",
  user_id: "987654321",
  user_login: "streamer1",
  user_name: "Streamer One",
  game_id: "111",
  game_name: "Example Game 1",
  type: "live",
  title: "Streaming for fun!",
  viewer_count: 100,
  started_at: "2023-01-01T12:00:00Z",
  language: "en",
  thumbnail_url: "https://example.com/thumbnail1.jpg",
  tag_ids: ["tag1", "tag2"],
  tags: ["Tag One", "Tag Two"],
  is_mature: false,
};

export function generateJoined(len: number) {
  const joinedAtoms: JoinedAtomValue[] = [];
  for (let i = 0; i < len; i++) {
    const channelName = `test${i}`;
    const joined = createJoinedAtomVal(channelName, twitchStream);
    joinedAtoms.push(joined);
  }
  return joinedAtoms;
}
