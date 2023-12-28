import { createPortal } from "react-dom";

type Props = {
  recommendedTags: string[];
  onSelect: (tag: string) => void;
};

export function RecommendedTags({ recommendedTags }: Props) {
  return (
    <div className="sticky top-0 left-0 bg-slate-700 p-2 rounded flex flex-col">
      {recommendedTags.map((tag) => {
        return <span>{tag}</span>;
      })}
    </div>
  );
}
