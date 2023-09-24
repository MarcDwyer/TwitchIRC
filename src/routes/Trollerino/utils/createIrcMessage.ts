import { Badges, IrcMessage } from "@src/twitchChat/twitch_data";

type CreateIRCMessageParams = {
  username: string;
  message: string;
  channelName: string;
};
const badges: Badges = {
  subscriber: false,
  glitchcon: true,
  turbo: false,
  moderator: true,
};

export const createIRCMessage = ({
  username,
  message,
  channelName,
}: CreateIRCMessageParams): IrcMessage => ({
  tags: {
    "display-name": username,
    "room-id": "123456",
    id: "abc123",
    color: "#FF0000",
    emotes: "emote1:1-5/emote2:10-15",
    mod: "1",
    flags: "abc",
    subscriber: "1",
    "tmi-sent-ts": "1632398888",
    turbo: "0",
    "user-id": "987654",
    "user-type": "viewer",
  },
  directMsg: false,
  raw: "",
  badges,
  prefix: "",
  command: "PRIVMSG",
  channel: channelName,
  params: [],
  message,
  username,
});
// const dummyIrcMessage: IrcMessage = ;
