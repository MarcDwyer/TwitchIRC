import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";
import { useActiveChannel } from "../../hooks/useActiveChannel";

export const IRCView = () => {
  const { joined, followers } = useTwitch();

  const { activeChannel, setChannelName, send } = useActiveChannel(joined);

  return (
    <div className="w-full h-full flex flex-col">
      {followers.streams && followers.streams.length && (
        <>
          <ChannelsRow
            activeChannelName={activeChannel?.channel.channelName}
            setActiveChannel={setChannelName}
          />
          {activeChannel && (
            <ChatBox activeChannel={activeChannel} send={send} />
          )}
        </>
      )}
    </div>
  );
};
