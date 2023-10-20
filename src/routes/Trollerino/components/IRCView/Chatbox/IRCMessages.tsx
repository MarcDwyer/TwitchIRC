import { JoinedAtomValue } from "@src/routes/Trollerino/atoms/joined";
import { useEffect, useRef } from "react";
import { useChatPause } from "./hooks/useChatPause";

type Props = {
  activeChannel: JoinedAtomValue;
  pause: () => void;
  unpause: () => void;
};
// may need to split this up into multiple custom hooks
export function IRCMessages({ activeChannel, pause, unpause }: Props) {
  const { chatEleRef, setChatToBottom } = useChatPause({
    pause,
    unpause,
    paused: activeChannel.paused,
  });

  useEffect(() => {
    if (!activeChannel.paused) {
      setChatToBottom();
    }
  }, [activeChannel.paused, activeChannel.messages]);

  return (
    <div
      onWheel={pause}
      ref={chatEleRef}
      className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full"
    >
      {activeChannel.paused && (
        <button>Chat has been paused: Click to unpause</button>
      )}
      {activeChannel.messages.map((message, index) => {
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
