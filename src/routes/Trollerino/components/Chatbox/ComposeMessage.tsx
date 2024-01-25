import { useState } from "react";
import { Chat } from "../../stores/chat";
import { useChatTrie } from "./hooks/useChatTrie";
import { RecommendedTags } from "./RecommendedTags";
import { insertTag } from "../../utils/Chatbox/insertTag";

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

  // useEffect(() => {
  //   return function () {
  //     setNewMessage("");
  //     // clearTrie();
  //   };
  // }, [chat, setNewMessage, clearTrie]);

  return (
    <div className="relative flex flex-col">
      {trieState.init && recommendedTags.length > 0 && (
        <RecommendedTags
          recommendedTags={recommendedTags}
          onSelect={(tag) => {
            const [insertedMsg, endOfTagIndices] = insertTag(
              tag,
              trieState.startOfTag,
              newMessage,
              trieState.taggedWord
            );
            setNewMessage(insertedMsg);
            clearTrie();
            const input = inputRef.current;
            console.log({ endOfTagIndices });
            if (input) {
              input.focus();
              input.selectionStart = endOfTagIndices;
              input.selectionEnd = endOfTagIndices;
            }
          }}
          clearTrie={clearTrie}
        />
      )}
      <form
        className="flex h-42 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          if (trieState.init) {
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
