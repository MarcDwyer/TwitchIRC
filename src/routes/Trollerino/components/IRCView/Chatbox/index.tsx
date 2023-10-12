import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveChannel } from "@src/routes/Trollerino/hooks/useActiveChannel";

export const ChatBox = () => {
  return (
    <>
      <IRCMessages />
      <ComposeMessage />
    </>
  );
};
