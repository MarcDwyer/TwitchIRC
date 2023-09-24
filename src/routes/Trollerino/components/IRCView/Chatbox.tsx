import { IrcMessage } from "@/twitchChat/twitch_data";
import { useState } from "react";

type Props = {
  messages: IrcMessage[];
  sendMessage: (msg: string) => void;
};
export const ChatBox = ({ messages, sendMessage }: Props) => {
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="w-full h-full p-4 shadow-md flex flex-col">
      <div className="h-full overflow-y-auto">
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
      <form
        className="flex h-42"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(newMessage);
          setNewMessage("");
        }}
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-l-md text-black"
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
    </div>
  );
};
