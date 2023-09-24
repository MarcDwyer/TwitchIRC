import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import { ChatBox } from "./Chatbox";
import { useActiveChannel } from "../../hooks/useActiveChannel";

export const IRCView = () => {
  const { joined } = useTwitch();

  const { activeChannel, setChannelName, activeMessages } =
    useActiveChannel(joined);

  return (
    <div className="w-full h-full flex flex-col">
      <ChannelsRow
        activeChannel={activeChannel}
        setActiveChannel={setChannelName}
      />
      {activeChannel && (
        <ChatBox
          messages={activeMessages}
          sendMessage={(msg: string) => {
            activeChannel.send(msg);
          }}
        />
      )}
    </div>
  );
};
