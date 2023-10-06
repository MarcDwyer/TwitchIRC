import { activeChannelState } from "@src/routes/Trollerino/atoms/activeChannel";
import { credentialsState } from "@src/routes/Trollerino/atoms/credentials";
import { messagesState } from "@src/routes/Trollerino/atoms/messages";
import { ircSocketState } from "@src/routes/Trollerino/selectors/twitchChat";
import { createIRCMessage } from "@src/routes/Trollerino/utils/createIrcMessage";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function ComposeMessage() {
  const activeChannel = useRecoilValue(activeChannelState);
  const ws = useRecoilValue(ircSocketState);
  const creds = useRecoilValue(credentialsState);
  const [, setMessages] = useRecoilState(messagesState);
  const [newMessage, setNewMessage] = useState("");

  return (
    <form
      className="flex h-42"
      onSubmit={(e) => {
        e.preventDefault();
        if (ws && activeChannel) {
          const query = `PRIVMSG ${activeChannel.channelName} :${newMessage}`;
          ws.send(query);
          setMessages((currMsgs) => {
            const msgs = currMsgs.get(activeChannel.channelName);
            if (!msgs || !creds) return currMsgs;
            msgs.push(
              createIRCMessage({
                username: creds?.loginName,
                channelName: activeChannel.channelName,
                message: newMessage,
              })
            );
            return new Map(currMsgs).set(activeChannel.channelName, msgs);
          });
        }
        setNewMessage("");
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-5 rounded-l-md text-black"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}
