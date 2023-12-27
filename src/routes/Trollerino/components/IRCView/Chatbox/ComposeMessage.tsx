import { JoinedValue } from "@src/routes/Trollerino/stores/joined";
import { Trie } from "@src/utils/trie";
import { useMemo, useRef, useState } from "react";

type Props = {
  send: (msg: string) => void;
  activeChannel: JoinedValue;
};
export function ComposeMessage({ send, activeChannel }: Props) {
  const [newMessage, setNewMessage] = useState("");
  const [{ initTrie, afterTag }, setTrieInfo] = useState({
    initTrie: false,
    afterTag: "",
  });

  // const trie = useRef<Trie>();
  const tagRecommendations = useMemo(() => {
    if (!initTrie) {
      return [];
    }
    const trie = new Trie();

    for (const chatter of activeChannel.chatters) {
      trie.insert(chatter);
    }
  }, [activeChannel.chatters, initTrie, newMessage]);
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
        onChange={(e) => {
          const lastCharTyped = (e.nativeEvent as Event & { data: string })
            .data;
          console.log({ e });
          if (lastCharTyped === "@" && !initTrie) {
            //initiate trie
            console.log("initiating trie");
            // setInitTrie(true);
          }

          if (initTrie) {
          }
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
