import { Trie } from "@src/utils/trie";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const createTrieState = () => ({
  init: false,
  taggedWord: "",
});

function isSingleAlphanumeric(str: string) {
  return str.length === 1 && str.match(/^[a-zA-Z0-9]+$/);
}
export type UseTrieParams = {
  newMessage: string;
  chatters: Set<string> | undefined;
};
export const useChatTrie = ({ newMessage, chatters }: UseTrieParams) => {
  const [trieState, setTrieState] = useState(createTrieState());
  const inputRef = useRef<HTMLInputElement | null>(null);

  const recommendedTags = useMemo(() => {
    const tri = new Trie();
    if (!trieState.init || !trieState.taggedWord.length || !chatters) return [];
    for (const chatter of chatters) {
      tri.insert(chatter);
    }
    console.log({ t: trieState.taggedWord });
    return tri.search(trieState.taggedWord);
  }, [trieState, chatters]);

  const handleInputEvt = useCallback(
    function (this: HTMLInputElement, ev: any) {
      if (!isSingleAlphanumeric(ev.key)) return;
      const lastIndex =
        this.selectionStart !== null ? this.selectionStart - 1 : 0;

      let word = "";
      for (let i = lastIndex; i >= 0; i--) {
        const char = newMessage[i];
        if (char === " ") break;
        word = char + word;
      }
      if (word[0] === "@") {
        console.log("tag detected");
        setTrieState({
          init: true,
          taggedWord: word.substring(1, word.length),
        });
      } else {
        setTrieState({
          init: false,
          taggedWord: "",
        });
      }
    },
    [newMessage, setTrieState]
  );

  const clearTrie = useCallback(() => {
    setTrieState(createTrieState());
  }, [setTrieState]);

  useEffect(() => {
    const input = inputRef.current as HTMLInputElement | null;
    if (input) {
      input.addEventListener("keyup", handleInputEvt);
    }

    return function () {
      if (input) {
        input.removeEventListener("keyup", handleInputEvt);
      }
    };
  }, [handleInputEvt]);

  return {
    inputRef,
    trieState,
    recommendedTags,
    clearTrie,
  };
};
