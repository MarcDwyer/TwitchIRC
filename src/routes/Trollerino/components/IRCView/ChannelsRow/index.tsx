import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useTwitch } from "../../../context/twitchCtx";
import { Channel } from "@src/twitchChat/channel";

type Props = {
  activeChannel: Channel | null | undefined;
  setActiveChannel: (channelName: string) => void;
};

export const ChannelsRow = ({ activeChannel, setActiveChannel }: Props) => {
  const { joined } = useTwitch();

  const streams = Array.from(joined.streams.values());

  return (
    <div className="w-full h-12 bg-gray-700 flex">
      <>
        {streams.map((stream, index) => (
          <div
            key={index}
            className={`cursor-pointer p-4 ${
              activeChannel && stream.channelName === activeChannel.channelName
                ? "bg-gray-500 text-white"
                : ""
            } relative`}
          >
            <FontAwesomeIcon
              className="absolute top-0 right-0 -m-2 p-2 text-white"
              icon={faX}
              onClick={() => joined.partChannel(stream.channelName)}
            />
            <span onClick={() => setActiveChannel(stream.user_login)}>
              {stream.channelName}
            </span>
          </div>
        ))}
      </>
    </div>
  );
};
