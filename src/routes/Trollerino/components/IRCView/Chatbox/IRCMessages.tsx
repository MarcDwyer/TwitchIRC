import { useRecoilValue } from "recoil";
import { activeChannelState } from "@src/routes/Trollerino/atoms/activeChannelName";
import { messagesState } from "@src/routes/Trollerino/atoms/messages";

export function IRCMessages() {
  const activeChannel = useRecoilValue(activeChannelState);
  const messages = useRecoilValue(messagesState);

  const activeMessages = messages.get(activeChannel?.channelName ?? "");

  return (
    <div className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full">
      {activeMessages &&
        activeMessages.map((message, index) => {
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
