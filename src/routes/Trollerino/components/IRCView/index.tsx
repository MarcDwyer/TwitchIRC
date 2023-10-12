import { JoinedTabs } from "./JoinedTabs";
import { ChatBox } from "./Chatbox";

export const IRCView = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <JoinedTabs />
      <ChatBox />
    </div>
  );
};
