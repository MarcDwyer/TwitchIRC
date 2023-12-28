import { Trie } from "@src/utils/trie";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const createTrieState = () => ({
  init: false,
  startIndex: -1,
  taggedWord: "",
});
function isBeginningOfWord(word: string, index: number) {
  const prevChar = word[index - 1];

  if (prevChar === " " || !prevChar) {
    return true;
  }
  return false;
}
function getTaggedWord(word: string, startIndex: number) {
  let taggedWord = "";

  for (let i = startIndex; startIndex < word.length; i++) {
    const char = word[i];
    if (char === "" || !char) {
      break;
    }
    taggedWord += char;
  }
  return taggedWord;
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
    return tri.search(trieState.taggedWord);
  }, [trieState, chatters]);

  const handleInputEvt = useCallback(
    function (this: HTMLInputElement, evt: KeyboardEvent) {
      const lastChar = evt.key;
      const lastIndex =
        this.selectionStart !== null ? this.selectionStart - 1 : -1;

      if (lastChar === " " && trieState.init) {
        setTrieState(createTrieState());
      } else if (
        !trieState.init &&
        lastChar === "@" &&
        Number.isInteger(lastIndex) &&
        lastIndex !== -1 &&
        isBeginningOfWord(newMessage, lastIndex)
      ) {
        setTrieState({
          ...trieState,
          init: true,
          startIndex: lastIndex,
        });
      }
    },
    [newMessage, setTrieState]
  );

  useEffect(() => {
    if (inputRef.current) {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keyup", handleInputEvt);
        inputRef.current?.addEventListener("keyup", handleInputEvt);
      }
      return function () {
        if (inputRef.current) {
          inputRef.current.removeEventListener("keyup", handleInputEvt);
        }
      };
    }
  }, [handleInputEvt]);

  useEffect(() => {
    if (trieState.init) {
      const taggedWord = getTaggedWord(newMessage, trieState.startIndex + 1);
      if (taggedWord === trieState.taggedWord) {
        return;
      }
      setTrieState({
        ...trieState,
        taggedWord,
      });
    }
  }, [trieState, newMessage, setTrieState]);

  return {
    inputRef,
    trieState,
    recommendedTags,
  };
};
