import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { useActiveChannel } from "../../hooks/useActiveChannel";
import { useJoined } from "../../hooks/useJoined";
import { generateJoined } from "@src/mocks/generateJoined";

export const JoinedTabs = () => {
  const { activeChannel, setActiveChannel } = useActiveChannel();
  const { joined, part } = useJoined();
  const streams = useMemo(
    () => Array.from([...joined.values(), ...generateJoined(0)]),
    [joined]
  );

  return (
    <div className="w-full bg-gray-700 flex flex-nowrap h-20 overflow-x-auto">
      {streams.map((stream, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              // set active channel
              setActiveChannel(stream.channelName);
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
                <span className="truncate m-auto">
                  {stream.streamData.user_name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
