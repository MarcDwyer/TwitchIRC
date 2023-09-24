import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useTwitch } from "../../../context/twitchCtx";

type Props = {
  activeChannelName: string | undefined;
  setActiveChannel: (channelName: string) => void;
};

export const ChannelsRow = ({ activeChannelName, setActiveChannel }: Props) => {
  const { joined } = useTwitch();

  const streams = Array.from(joined.streams.values());

  return (
    <div className="w-full h-12 bg-gray-700 flex">
      <>
        {streams.map((stream, index) => {
          const channelName = stream.channel.channelName;
          return (
            <div
              key={index}
              className={`cursor-pointer ${
                activeChannelName &&
                stream.channel.channelName === activeChannelName
                  ? "bg-gray-500 text-white"
                  : ""
              }`}
            >
              <div className="flex flex-col">
                <div
                  onClick={() => {
                    console.log("clicked");
                    joined.partChannel(channelName);
                  }}
                  className="ml-auto"
                >
                  <FontAwesomeIcon className="text-white" icon={faX} />
                </div>
                <span
                  onClick={() => setActiveChannel(stream.streamInfo.user_login)}
                >
                  {channelName}
                </span>
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
};
