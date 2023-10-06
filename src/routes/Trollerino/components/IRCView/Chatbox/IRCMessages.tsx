import { useRecoilValue } from "recoil";
import { activeChannelState } from "@src/routes/Trollerino/atoms/activeChannel";
import { messagesState } from "@src/routes/Trollerino/atoms/messages";

export function IRCMessages() {
  const activeChannel = useRecoilValue(activeChannelState);
  const messages = useRecoilValue(messagesState);

  const activeMessages = messages.get(activeChannel?.channelName ?? "");

  return (
    <div className="h-5/6 w-5/6 overflow-y-auto m-auto border-2">
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
