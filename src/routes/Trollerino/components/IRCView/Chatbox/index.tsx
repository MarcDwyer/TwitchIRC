import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveChannel } from "@src/routes/Trollerino/hooks/useActiveChannel";
import { TwitchLink } from "@src/components/TwitchLink";

export const ChatBox = () => {
  const { activeChannel, send, linkToStream, pause, unpause } =
    useActiveChannel();
  return (
    <>
      {activeChannel && (
        <>
          <div className="m-2 flex">
            {linkToStream && (
              <TwitchLink
                classNames="m-auto"
                href={linkToStream}
                text={`Watch ${activeChannel.streamData.user_name}`}
              />
            )}
          </div>
          {activeChannel.paused && (
            <button onClick={unpause}>Chat Paused: Click to unpause</button>
          )}
          <IRCMessages
            activeChannel={activeChannel}
            pause={pause}
            unpause={unpause}
          />
          <ComposeMessage send={send} />
        </>
      )}
    </>
  );
};
