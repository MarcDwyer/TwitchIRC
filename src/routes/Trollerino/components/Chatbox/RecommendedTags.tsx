import { ModalBackground } from "@src/components/ModalBackground";
import { useRecommendedTags } from "./hooks/useRecommendedTags";

type Props = {
  recommendedTags: string[];
  onSelect: (tag: string) => void;
  clearTrie: () => void;
};

export function RecommendedTags({
  recommendedTags,
  clearTrie,
  onSelect,
}: Props) {
  const selectedTag = useRecommendedTags({
    onSelect,
    tags: recommendedTags,
  });

  return (
    <div className="sticky top-0 left-0 flex z-20">
      <ModalBackground
        onClick={() => {
          clearTrie();
        }}
      />
      <div className="w-1/4 bg-slate-700 p-2 rounded-md flex flex-col">
        {recommendedTags.map((tag) => {
          const isSel = selectedTag === tag;
          return (
            <span
              key={tag}
              className={`${isSel ? "bg-slate-900" : ""} p-2 rounded-md`}
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
