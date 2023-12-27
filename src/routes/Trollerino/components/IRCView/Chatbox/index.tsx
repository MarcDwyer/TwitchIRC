import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { TwitchLink } from "@src/components/TwitchLink";
import { useActiveChannelStore } from "@src/routes/Trollerino/stores/activeChannel";
import { useMemo } from "react";
import { useChatStore } from "@src/routes/Trollerino/stores/chat";

export const ChatBox = () => {
  const {
    channel: activeChannel,
    chat,
    paused,
    setPaused,
  } = useActiveChannelStore();
  const sendMsg = useChatStore((store) => store.sendMsg);

  const linkToStream = useMemo(() => {
    if (!activeChannel) {
      return null;
    }
    const link = "https://twitch.tv/" + activeChannel.streamData.user_name;
    return link;
  }, [activeChannel]);

  const pause = () => setPaused(true);

  const resume = () => setPaused(false);

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
          {paused && (
            <div className="flex w-full">
              <button
                className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={resume}
              >
                Chat Paused: Click to unpause
              </button>
            </div>
          )}
          <>
            <IRCMessages
              messages={chat?.messages ?? []}
              paused={paused}
              pause={pause}
              resume={resume}
            />
            <ComposeMessage
              activeChannel={activeChannel}
              send={(message) => sendMsg(message, activeChannel.channelName)}
            />
          </>
        </>
      )}
    </>
  );
};
