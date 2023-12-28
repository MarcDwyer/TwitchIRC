import { useEffect, useMemo } from "react";
import { JoinedTab } from "./JoinedTab";
import { useJoinedStore } from "@src/routes/Trollerino/stores/joined";
import { useShallow } from "zustand/react/shallow";
import { useActiveChannelStore } from "@src/routes/Trollerino/stores/activeChannel";

export const JoinedTabs = () => {
  const joined = useJoinedStore((store) => store.joined);

  const streams = useMemo(() => Array.from(joined.values()), [joined]);
  const { activeChannel, setActiveChannel } = useActiveChannelStore(
    useShallow((store) => ({
      activeChannel: store.channel,
      setActiveChannel: store.setActiveChannel,
    }))
  );

  const { part, resetMentioned } = useJoinedStore(
    useShallow((store) => ({
      part: store.part,
      resetMentioned: store.resetMentioned,
    }))
  );

  useEffect(() => {
    if (!activeChannel && streams.length) {
      setActiveChannel(streams[0]);
    }
  }, [activeChannel, streams, setActiveChannel]);

  return (
    <div className="w-full bg-gray-700 flex flex-nowrap overflow-x-auto h-12">
      {streams.map((stream, index) => (
        <JoinedTab
          key={index}
          stream={stream}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          resetMentioned={resetMentioned}
          part={part}
        />
      ))}
    </div>
  );
};
