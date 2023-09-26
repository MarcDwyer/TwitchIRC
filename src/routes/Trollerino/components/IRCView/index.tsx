import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";
import { useActiveChannel } from "../../hooks/useActiveChannel";
import { useEffect } from "react";

export const IRCView = () => {
  const { joined, followers } = useTwitch();

  const { activeKeyName, setActiveKeyName, send, activeChannel } =
    useActiveChannel(joined);

  useEffect(() => {
    if (activeChannel && activeChannel.mentioned) {
      joined.setMentioned(activeChannel?.keyName, false);
    }
  }, [activeChannel]);

  return (
    <div className="w-full h-full flex flex-col">
      {followers.streams && followers.streams.length && (
        <>
          <ChannelsRow
            activeKeyName={activeKeyName}
            setActiveKeyName={setActiveKeyName}
          />
          {activeChannel && (
            <ChatBox activeChannel={activeChannel} send={send} />
          )}
        </>
      )}
    </div>
  );
};
