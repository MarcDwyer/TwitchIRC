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
                newTab={true}
              />
            )}
          </div>
          {activeChannel.paused && (
            <div className="flex w-full">
              <button
                className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={unpause}
              >
                Chat Paused: Click to unpause
              </button>
            </div>
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
