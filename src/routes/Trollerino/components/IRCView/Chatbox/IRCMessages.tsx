import { JoinedAtomValue } from "@src/routes/Trollerino/atoms/joined";
import { useEffect, useRef, useState } from "react";

type Props = {
  activeChannel: JoinedAtomValue;
  setPaused: (pause: boolean) => void;
};

export function IRCMessages({ activeChannel, setPaused }: Props) {
  const parentRef = useRef<any>();
  const [didScroll, setDidScroll] = useState(false);

  const setBottom = () => {
    parentRef.current.scrollTop = parentRef.current.scrollHeight;
  };
  useEffect(() => {
    if (parentRef.current && !didScroll) {
      setBottom();
    }
  }, [activeChannel.messages, parentRef, didScroll]);

  return (
    <div
      onWheel={() => {
        const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
        const height = scrollTop + clientHeight;
        const percentageHeight = scrollHeight * 0.05;
        const isBottom = height >= scrollHeight - percentageHeight;
        if (activeChannel.paused && isBottom) {
          setBottom();
          setDidScroll(false);
        } else {
          setDidScroll(true);
        }
      }}
      ref={parentRef}
      className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full"
    >
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
