import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { memo, useEffect, useMemo } from "react";
import { JoinedValue } from "@src/routes/Trollerino/stores/joined";

type Props = {
  stream: JoinedValue;
  activeChannel: JoinedValue | null;
  setActiveChannel: (channel: JoinedValue) => void;
  part: (channelName: string) => void;
  resetMentioned: (channelName: string) => void;
};

export const JoinedTab = memo(
  ({
    stream,
    activeChannel,
    setActiveChannel,
    part,
    resetMentioned,
  }: Props) => {
    const isActiveChannel = useMemo(
      () => stream.channelName === activeChannel?.channelName,
      [stream.channelName, activeChannel]
    );

    useEffect(() => {
      if (activeChannel && stream.mentioned && isActiveChannel) {
        resetMentioned(activeChannel.channelName);
      }
    }, [isActiveChannel, resetMentioned, stream, activeChannel]);

    return (
      <div
        onClick={() => {
          setActiveChannel(stream);
        }}
        className={`border flex-none w-32 border-slate-800 cursor-pointer relative flex ${
          activeChannel && isActiveChannel ? "bg-gray-500 text-white" : ""
        } ${!isActiveChannel && stream.mentioned ? "bg-orange-500" : ""}`}
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
            <span className="truncate m-auto">
              {stream.streamData.user_name}
            </span>
          </div>
        </div>
      </div>
    );
  }
);
