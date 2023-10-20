import { JoinedAtomValue } from "@src/routes/Trollerino/atoms/joined";
import { useEffect, useRef, useState } from "react";

type Props = {
  activeChannel: JoinedAtomValue;
  pause: () => void;
  unpause: () => void;
};
// may need to split this up into multiple custom hooks
export function IRCMessages({ activeChannel, pause, unpause }: Props) {
  const parentRef = useRef<any>();
  const prevPause = useRef(activeChannel.paused);
  const setBottom = () => {
    parentRef.current.scrollTop = parentRef.current.scrollHeight;
  };
  const checkIfBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    return scrollHeight - scrollTop === clientHeight;
  };
  useEffect(() => {
    if (parentRef.current && !activeChannel.paused) {
      setBottom();
    }
  }, [activeChannel.messages, parentRef, activeChannel.paused]);

  useEffect(() => {
    if (prevPause.current !== activeChannel.paused) {
      setBottom();
    }
    prevPause.current = activeChannel.paused;
  }, [activeChannel.paused]);

  useEffect(() => {
    let interval: number;

    if (activeChannel.paused) {
      interval = setInterval(() => {
        const isBottom = checkIfBottom();
        console.log({ isBottom });
        if (isBottom) {
          unpause();
          clearInterval(interval);
        }
      }, 350);
    }

    return function () {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [activeChannel.paused, unpause, parentRef.current]);

  return (
    <div
      onWheel={() => {
        pause();
        // const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
        // const height = scrollTop + clientHeight;
        // // const percentageHeight = scrollHeight * 0.05;
        // const isBottom = height >= scrollHeight - scrollHeight;
        // console.log(activeChannel.paused, isBottom);

        // if (activeChannel.paused && isBottom) {
        //   setPaused(false);
        // } else {
        //   setPaused(true);
        // }
      }}
      ref={parentRef}
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
