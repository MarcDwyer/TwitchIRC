import { useCallback, useEffect, useRef, useState } from "react";
import { Chat } from "../../stores/chat";
import { useChatTrie } from "./hooks/useChatTrie";
import { RecommendedTags } from "./RecommendedTags";
import { insertTag } from "../../utils/Chatbox/insertTag";

type Props = {
  send: (msg: string) => void;
  chat: Chat | null;
};
const SubmitKeys = new Set(["Enter", "Tab"]);
const isSubmitKey = (key: string) => SubmitKeys.has(key);
const isNavKey = (key: string) => key.startsWith("Arrow");

export function ComposeMessage({ send, chat }: Props) {
  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef<HTMLInputElement>();

  const { recommendedTags, trieState, clearTrie, detectTag } = useChatTrie({
    chatters: chat?.chatters,
    newMessage,
  });

  useEffect(() => {
    return function () {
      setNewMessage("");
    };
  }, [send, setNewMessage]);

  const handleInputEvt = useCallback(
    function (this: HTMLInputElement, evt: any) {
      const key = evt.key;
      if (isSubmitKey(key) || isNavKey(key)) {
        return;
      }
      detectTag.call(this as HTMLInputElement, evt);
    },
    [detectTag]
  );
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener("keyup", handleInputEvt);
    }
    return function () {
      input?.removeEventListener("keyup", handleInputEvt);
    };
  }, [handleInputEvt]);

  return (
    <div className="relative flex flex-col">
      {trieState.init && recommendedTags.length > 0 && (
        <RecommendedTags
          recommendedTags={recommendedTags}
          onSelect={(tag) => {
            const [insertedMsg, endOfTagIndices] = insertTag({
              completeTag: tag,
              startOfTag: trieState.startOfTag,
              searchTag: trieState.taggedWord,
              msg: newMessage,
            });
            const input = inputRef.current;
            if (input) {
              input.focus();
              input.setSelectionRange(endOfTagIndices, endOfTagIndices);
            }
            setNewMessage(insertedMsg);
            clearTrie();
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
