import { JoinedAtomValue } from "@src/routes/Trollerino/atoms/joined";
import { useEffect } from "react";
import { useChatPause } from "./hooks/useChatPause";
import { IrcMessage } from "@src/twitchChat/twitch_data";

type Props = {
  activeChannel: JoinedAtomValue;
  messages: IrcMessage[];
  pause: () => void;
  resume: () => void;
};
export function IRCMessages({ activeChannel, pause, resume, messages }: Props) {
  const { chatEleRef, setChatToBottom } = useChatPause({
    pause,
    unpause: resume,
    paused: activeChannel.paused,
  });

  useEffect(() => {
    if (!activeChannel.paused) {
      setChatToBottom();
    }
  }, [activeChannel.paused, activeChannel.messages]);
  console.log({ messages, activeChannel });
  return (
    <div
      onWheel={pause}
      ref={chatEleRef}
      className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full"
    >
      {activeChannel.paused && (
        <button>Chat has been paused: Click to unpause</button>
      )}
      {messages.map((message, index) => {
        const color = message.tags.color;
        return (
          <div key={index} className="mb-2">
            <strong
              style={{
                color,
              }}
            >
              {message.username}:{" "}
            </strong>
            {message.message}
          </div>
        );
      })}
    </div>
  );
}
