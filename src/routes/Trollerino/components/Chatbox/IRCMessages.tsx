import { useEffect } from "react";
import { useChatPause } from "./hooks/useChatPause";
import { IrcMessage } from "@src/twitchChat/twitch_data";

type Props = {
  paused: boolean;
  messages: IrcMessage[];
  pause: () => void;
  resume: () => void;
};
export function IRCMessages({ paused, pause, resume, messages }: Props) {
  const { chatEleRef, setChatToBottom } = useChatPause({
    pause,
    resume,
    paused,
  });

  useEffect(() => {
    if (!paused) {
      setChatToBottom();
    }
  }, [paused, messages, setChatToBottom]);
  return (
    <div
      onWheel={pause}
      ref={chatEleRef}
      className="h-full overflow-y-auto m-auto w-full overflow-x-hidden irc-messages relative"
    >
      {paused && <button>Chat has been paused: Click to unpause</button>}
      {messages.map((message, index) => {
        const color = message.tags.color;
        return (
          <div key={index} className="m-2">
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
