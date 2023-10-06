import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";

export const IRCView = () => {
  return (
    <>
      <div className="w-full h-full flex flex-col">
        <ChannelsRow />
        <ChatBox />
      </div>
    </>
  );
};
