import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";

export const ChatBox = () => {
  return (
    <>
      <IRCMessages />
      <ComposeMessage />
    </>
  );
};
