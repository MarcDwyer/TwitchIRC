import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";

export const ChatBox = () => {
  return (
    <div className="w-full h-full p-4 shadow-md flex flex-col border-2">
      <IRCMessages />
      <ComposeMessage />
    </div>
  );
};
