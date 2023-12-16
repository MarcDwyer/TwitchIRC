import { JoinedAtomValue } from "@src/routes/Trollerino/atoms/joined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useJoinedStore } from "@src/routes/Trollerino/stores/joined";
import { useShallow } from "zustand/react/shallow";
import { useActiveChannelStore } from "@src/routes/Trollerino/stores/activeChannel";

type Props = {
  stream: JoinedAtomValue;
};

export function JoinedTab({ stream }: Props) {
  const activeChannel = useActiveChannelStore();

  const { part, resetMentioned } = useJoinedStore(
    useShallow((store) => ({
      part: store.part,
      resetMentioned: store.resetMentioned,
    }))
  );

  useEffect(() => {
    if (activeChannel?.channelName === stream.channelName && stream.mentioned) {
      resetMentioned(stream.channelName);
    }
  }, [activeChannel, stream, resetMentioned]);

  return (
    <div
      onClick={() => {
        // set active channel
        activeChannel.setActiveChannel(stream.channelName);
      }}
      className={`border flex-none w-32 border-slate-800 cursor-pointer relative flex ${
        activeChannel && stream.channelName === activeChannel?.channelName
          ? "bg-gray-500 text-white"
          : ""
      } ${stream.mentioned ? "bg-orange-500" : ""}`}
    >
      <div className="flex flex-col w-full">
        <div
          onClick={(e) => {
            e.stopPropagation();
            part(stream.channelName);
          }}
          className="absolute top-0 right-1"
        >
          <FontAwesomeIcon className="text-white" icon={faX} />
        </div>
        <div className="w-full flex mt-auto ml-auto mr-auto">
          <span className="truncate m-auto">{stream.streamData.user_name}</span>
        </div>
      </div>
    </div>
  );
}
