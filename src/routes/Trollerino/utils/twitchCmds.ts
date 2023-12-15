const join = (channelName: string) => `JOIN ${channelName}`;

const send = (channelName: string, message: string) =>
  `PRIVMSG ${channelName} :${message}`;

const part = (channelName: string) => `PART ${channelName}`;

export const TwitchCmds = {
  join,
  send,
  part,
};
