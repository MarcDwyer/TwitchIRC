import { Trie } from "@src/utils/trie";
import { useCallback, useMemo, useState } from "react";

const createTrieState = () => ({
  init: false,
  taggedWord: "",
  startOfTag: -1,
});

export function isSingleAlphanumeric(str: string) {
  return str.match(/^[a-zA-Z0-9]+$/);
}
export type UseTrieParams = {
  newMessage: string;
  chatters: Set<string> | undefined;
};
export const useChatTrie = ({ newMessage, chatters }: UseTrieParams) => {
  const [trieState, setTrieState] = useState(createTrieState());

  const recommendedTags = useMemo(() => {
    const tri = new Trie();
    if (!trieState.init || !trieState.taggedWord.length || !chatters) return [];
    for (const chatter of chatters) {
      tri.insert(chatter);
    }
    return tri.search(trieState.taggedWord);
  }, [trieState, chatters]);

  const detectTag = useCallback(
    function (this: HTMLInputElement, { key }: any) {
      if (key.length !== 1 || !isSingleAlphanumeric(key)) {
        return;
      }
      const lastIndex =
        this.selectionStart !== null ? this.selectionStart - 1 : 0;

      let word = "";
      for (let i = lastIndex; i >= 0; i--) {
        const char = newMessage[i];
        if (char === " ") break;
        word = char + word;
      }
      if (word[0] === "@" && word.length >= 2) {
        const taggedWord = word.substring(1, word.length);
        setTrieState({
          init: true,
          taggedWord,
          startOfTag: lastIndex - taggedWord.length + 1,
        });
      } else {
        setTrieState({
          init: false,
          taggedWord: "",
          startOfTag: -1,
        });
      }
    },
    [newMessage, setTrieState]
  );

  const clearTrie = useCallback(() => {
    setTrieState(createTrieState());
  }, [setTrieState]);

  return {
    trieState,
    recommendedTags,
    clearTrie,
    detectTag,
  };
};
