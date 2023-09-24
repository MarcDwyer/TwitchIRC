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
              className={`cursor-pointer p-4 ${
                activeChannelName &&
                stream.channel.channelName === activeChannelName
                  ? "bg-gray-500 text-white"
                  : ""
              } relative`}
            >
              <FontAwesomeIcon
                className="absolute top-0 right-0 -m-2 p-2 text-white"
                icon={faX}
                onClick={() => joined.partChannel(channelName)}
              />
              <span
                onClick={() => setActiveChannel(stream.streamInfo.user_login)}
              >
                {channelName}
              </span>
            </div>
          );
        })}
      </>
    </div>
  );
};
