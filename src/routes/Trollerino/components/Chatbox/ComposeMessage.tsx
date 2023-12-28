import { JoinedValue } from "@src/routes/Trollerino/stores/joined";
import { useState } from "react";
import { Chat } from "../../stores/chat";
import { useChatTrie } from "./hooks/useChatTrie";

type Props = {
  send: (msg: string) => void;
  activeChannel: JoinedValue;
  chat: Chat | null;
};

export function ComposeMessage({ send, activeChannel, chat }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const { inputRef, recommendedTags } = useChatTrie({
    chatters: chat?.chatters,
    newMessage,
  });
  return (
    <form
      className="flex h-42"
      onSubmit={(e) => {
        e.preventDefault();
        send(newMessage);
        setNewMessage("");
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-5 rounded-l-md text-black"
        value={newMessage}
        ref={inputRef}
        onChange={(e) => {
          setNewMessage(e.target.value);
        }}
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
