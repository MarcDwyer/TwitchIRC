import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { TwitchLink } from "@src/components/TwitchLink";
import { useShallow } from "zustand/react/shallow";
import { useActiveChannelStore } from "@src/routes/Trollerino/stores/activeChannel";
import { useMemo } from "react";

export const ChatBox = () => {
  const { activeChannel, messages } = useActiveChannelStore(
    useShallow((store) => ({
      activeChannel: store.channel,
      messages: store.messages,
      // setPaused: store.setPaused,
      // send: store.send,
    }))
  );

  const linkToStream = useMemo(() => {
    if (!activeChannel) {
      return null;
    }
    const link = "https://twitch.tv/" + activeChannel.streamData.user_name;
    return link;
  }, [activeChannel]);

  return (
    <>
      {activeChannel && (
        <>
          <div className="m-2 flex">
            {linkToStream && (
              <TwitchLink
                classNames="m-auto"
                href={linkToStream}
                text={`Watch ${activeChannel.streamData.user_login}`}
                newTab={true}
              />
            )}
          </div>
          {activeChannel.paused && (
            <div className="flex w-full">
              <button
                className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => {}}
              >
                Chat Paused: Click to unpause
              </button>
            </div>
          )}
          <IRCMessages
            messages={messages}
            activeChannel={activeChannel}
            pause={() => {}}
            resume={() => {}}
          />
          <ComposeMessage send={() => {}} />
        </>
      )}
    </>
  );
};
