import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveChannel } from "@src/routes/Trollerino/hooks/useActiveChannel";

export const ChatBox = () => {
  const { activeChannel, send } = useActiveChannel();
  return (
    <>
      <IRCMessages messages={activeChannel?.messages ?? []} />
      <ComposeMessage send={send} />
    </>
  );
};
