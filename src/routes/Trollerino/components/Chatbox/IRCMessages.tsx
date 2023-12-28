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
      className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full"
    >
      {paused && <button>Chat has been paused: Click to unpause</button>}
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
