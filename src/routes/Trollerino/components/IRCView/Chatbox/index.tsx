import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveStream } from "../context/ActiveStreamCtx";

export const ChatBox = () => {
  const { activeStream } = useActiveStream();
  return (
    <div className="w-full h-full p-4 shadow-md flex flex-col border-2">
      {activeStream && <IRCMessages activeStream={activeStream} />}
      <ComposeMessage />
    </div>
  );
};
