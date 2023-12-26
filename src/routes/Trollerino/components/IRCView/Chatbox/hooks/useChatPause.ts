import { useEffect, useRef } from "react";

// dont actually know the type of this yet
const setBottom = (ele: any) => {
  ele.scrollTop = ele.scrollHeight;
};
const checkIfBottom = (ele: any) => {
  const { scrollTop, scrollHeight, clientHeight } = ele;
  return scrollHeight - scrollTop === clientHeight;
};
type UsePauseHandlerProps = {
  paused: boolean;
  pause: () => void;
  unpause: () => void;
};

export const useChatPause = ({ paused, unpause }: UsePauseHandlerProps) => {
  const prevPause = useRef(paused);
  const chatEleRef = useRef<any>();

  const setChatToBottom = () => setBottom(chatEleRef.current);

  useEffect(() => {
    if (prevPause.current !== paused) {
      setChatToBottom();
    }
    prevPause.current = paused;
  }, [paused]);

  useEffect(() => {
    let interval: number;

    if (paused) {
      interval = setInterval(() => {
        const isBottom = checkIfBottom(chatEleRef.current);
        if (isBottom) {
          unpause();
          clearInterval(interval);
        }
      }, 550);
    }
    return function () {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [paused, unpause]);

  return {
    chatEleRef,
    setChatToBottom,
  };
};
