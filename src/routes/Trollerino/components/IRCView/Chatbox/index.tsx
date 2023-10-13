import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveChannel } from "@src/routes/Trollerino/hooks/useActiveChannel";
import { TwitchLink } from "@src/components/TwitchLink";

export const ChatBox = () => {
  const { activeChannel, send, linkToStream } = useActiveChannel();
  console.log({ activeChannel });
  return (
    <>
      {linkToStream && activeChannel && (
        <div className="m-2 flex">
          <TwitchLink
            classNames="m-auto"
            href={linkToStream}
            text={`Watch ${activeChannel.streamData.user_name}`}
          />
        </div>
      )}
      <IRCMessages messages={activeChannel?.messages ?? []} />
      <ComposeMessage send={send} />
    </>
  );
};
