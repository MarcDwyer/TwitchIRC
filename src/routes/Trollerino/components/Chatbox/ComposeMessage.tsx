import { useState } from "react";
import { Chat } from "../../stores/chat";
import { useChatTrie } from "./hooks/useChatTrie";
import { RecommendedTags } from "./RecommendedTags";

type Props = {
  send: (msg: string) => void;
  chat: Chat | null;
};

export function ComposeMessage({ send, chat }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const { inputRef, recommendedTags, trieState, clearTrie } = useChatTrie({
    chatters: chat?.chatters,
    newMessage,
  });
  return (
    <div className="relative p-2 flex flex-col">
      {trieState.init && recommendedTags.length > 0 && (
        <RecommendedTags
          recommendedTags={recommendedTags}
          onSelect={() => {}}
          clearTrie={clearTrie}
        />
      )}
      <form
        className="flex h-42 mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (trieState.init) {
            console.log(`Submitted tag: ${trieState.taggedWord}`);
            clearTrie();
            return;
          }
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
    </div>
  );
}
