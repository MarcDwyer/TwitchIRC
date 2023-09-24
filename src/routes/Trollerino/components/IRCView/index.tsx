import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";
import { useActiveChannel } from "../../hooks/useActiveChannel";

export const IRCView = () => {
  const { joined } = useTwitch();

  const { activeChannel, setChannelName } = useActiveChannel(joined);

  return (
    <div className="w-full h-full flex flex-col">
      <ChannelsRow
        activeChannelName={activeChannel?.channel.channelName}
        setActiveChannel={setChannelName}
      />
      {activeChannel && (
        <ChatBox
          messages={activeChannel.messages}
          sendMessage={(msg: string) => {
            activeChannel.channel.send(msg);
          }}
        />
      )}
    </div>
  );
};
