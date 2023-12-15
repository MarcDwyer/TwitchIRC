import { useMemo } from "react";
import { useJoined } from "../../../hooks/useJoined";
import { JoinedTab } from "./JoinedTab";

export const JoinedTabs = () => {
  const { joined } = useJoined();
  const streams = useMemo(() => Array.from(joined.values()), [joined]);

  return (
    <div className="w-full bg-gray-700 flex flex-nowrap h-20 overflow-x-auto">
      {streams.map((stream, index) => (
        <JoinedTab stream={stream} key={index} />
      ))}
    </div>
  );
};
