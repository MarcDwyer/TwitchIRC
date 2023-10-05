import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useTwitch } from "../../../context/twitchCtx";
import {
  useActiveStream,
  useActiveStreamActions,
} from "../context/ActiveStreamCtx";

export const ChannelsRow = () => {
  const { joined } = useTwitch();
  const { activeStream } = useActiveStream();
  const { setStreamKey } = useActiveStreamActions();

  const streams = Array.from(joined.streams.values());

  return (
    <div className="w-full bg-gray-700 flex h-16">
      <>
        {streams.map((stream, index) => {
          const mentioned =
            stream.mentioned && stream.keyName !== activeStream?.keyName;
          return (
            <div
              key={index}
              className={`cursor-pointer w-32 ${
                activeStream?.keyName && stream.keyName === activeStream.keyName
                  ? "bg-gray-500 text-white"
                  : ""
              } ${mentioned ? "bg-orange-500" : ""}`}
            >
              <div className="flex flex-col">
                <div
                  onClick={() => {
                    console.log("clicked part");
                    joined.partChannel(stream.keyName);
                    setStreamKey("");
                  }}
                  className="ml-auto"
                >
                  <FontAwesomeIcon className="text-white" icon={faX} />
                </div>
                <div
                  className="w-full flex p-2"
                  onClick={() => setStreamKey(stream.keyName)}
                >
                  <span className="truncate m-auto">
                    {stream.streamInfo.user_name}
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
