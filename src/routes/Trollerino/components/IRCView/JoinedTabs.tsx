import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { useActiveChannel } from "../../hooks/useActiveChannel";
import { useJoined } from "../../hooks/useJoined";

export const JoinedTabs = () => {
  const { activeChannel, setActiveChannel } = useActiveChannel();
  const { joined, part } = useJoined();
  const streams = useMemo(() => Array.from(joined.values()), [joined]);

  return (
    <div className="w-full bg-gray-700 flex h-16">
      <>
        {streams.map((stream, index) => {
          return (
            <div
              key={index}
              className={`cursor-pointer w-32 ${
                activeChannel &&
                stream.channelName === activeChannel?.channelName
                  ? "bg-gray-500 text-white"
                  : ""
              } ${stream.mentioned ? "bg-orange-500" : ""}`}
            >
              <div className="flex flex-col">
                <div
                  onClick={() => {
                    part(stream.channelName);
                  }}
                  className="ml-auto"
                >
                  <FontAwesomeIcon className="text-white" icon={faX} />
                </div>
                <div
                  className="w-full flex p-2"
                  onClick={() => {
                    // set active channel
                    setActiveChannel(stream.channelName);
                  }}
                >
                  <span className="truncate m-auto">
                    {stream.streamData.user_name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
};
