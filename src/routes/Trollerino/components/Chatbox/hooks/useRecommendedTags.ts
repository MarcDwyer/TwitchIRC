import { useCallback, useEffect, useMemo, useState } from "react";

type UseRecommendedTagsParams = {
  tags: string[];
  onSelect: (selTag: string) => void;
};

export const useRecommendedTags = ({
  tags,
  onSelect,
}: UseRecommendedTagsParams) => {
  // short for SelectedTag
  const [selTagIndex, setSelTagIndex] = useState<number>(0);

  const handleKeyEvt = useCallback(
    (evt: KeyboardEvent) => {
      switch (evt.key) {
        case "Tab":
        case "Enter":
          onSelect(tags[selTagIndex]);
          break;
        case "ArrowDown":
          const nextUp = selTagIndex + 1;
          if (tags[nextUp]) {
            setSelTagIndex(nextUp);
          }
          break;
        case "ArrowUp":
          const nextDown = selTagIndex - 1;
          if (tags[nextDown]) {
            setSelTagIndex(selTagIndex - 1);
          }
          break;
      }
    },
    [setSelTagIndex, selTagIndex, onSelect]
  );

  useEffect(() => {
    document.addEventListener("keyup", handleKeyEvt);
    return function () {
      document.removeEventListener("keyup", handleKeyEvt);
    };
  }, [handleKeyEvt]);

  const selectedTag = useMemo(() => tags[selTagIndex], [selTagIndex, tags]);

  return selectedTag;
};
