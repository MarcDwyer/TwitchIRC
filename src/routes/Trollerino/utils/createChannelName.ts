export function createChannelName(userLogin: string) {
  let channelName = userLogin;
  if (channelName[0] !== "#") {
    channelName = "#" + channelName;
  }
  return channelName;
}
