import { IRCMessages } from "./IRCMessages";
import { ComposeMessage } from "./ComposeMessage";
import { useActiveChannelStore } from "@src/routes/Trollerino/stores/activeChannel";
import { useChatStore } from "@src/routes/Trollerino/stores/chat";
import { useCallback } from "react";

export const ChatBox = () => {
  const { channel: activeChannel, paused, setPaused } = useActiveChannelStore();
  const sendMsg = useChatStore((store) => store.sendMsg);

  const pause = () => setPaused(true);

  const resume = () => setPaused(false);

  const send = useCallback(
    (msg: string) => {
      if (activeChannel) {
        sendMsg(msg, activeChannel.channelName);
      }
    },
    [activeChannel?.channelName, sendMsg]
  );
  console.log("render");
  return (
    <div className="overflow-hidden h-full flex flex-col">
      {activeChannel && (
        <>
          {paused && (
            <div className="flex w-full">
              <button
                className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={resume}
              >
                Chat Paused: Click to unpause
              </button>
            </div>
          )}
          <IRCMessages
            messages={chat?.messages ?? []}
            paused={paused}
            pause={pause}
            resume={resume}
          />
          <ComposeMessage chat={chat} send={send} />
        </>
      )}
    </div>
  );
};
