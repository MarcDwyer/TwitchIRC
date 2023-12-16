import { useMemo } from "react";
import { JoinedTab } from "./JoinedTab";
import { useJoinedStore } from "@src/routes/Trollerino/stores/joined";

export const JoinedTabs = () => {
  const joined = useJoinedStore((store) => store.joined);
  const streams = useMemo(() => Array.from(joined.values()), [joined]);

  return (
    <div className="w-full bg-gray-700 flex flex-nowrap h-20 overflow-x-auto">
      {streams.map((stream, index) => (
        <JoinedTab stream={stream} key={index} />
      ))}
    </div>
  );
};
