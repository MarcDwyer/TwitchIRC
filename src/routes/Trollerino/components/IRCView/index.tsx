import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";
import { ActiveStreamProvider } from "./context/ActiveStreamCtx";

export const IRCView = () => {
  const { followers } = useTwitch();
  return (
    <ActiveStreamProvider>
      <div className="w-full h-full flex flex-col">
        {followers.streams && followers.streams.length && (
          <>
            <ChannelsRow />
            {activeChannel && (
              <ChatBox activeChannel={activeChannel} send={send} />
            )}
          </>
        )}
      </div>
    </ActiveStreamProvider>
  );
};
