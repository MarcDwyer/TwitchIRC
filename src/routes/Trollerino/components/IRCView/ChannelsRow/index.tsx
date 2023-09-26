import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useTwitch } from "../../../context/twitchCtx";

type Props = {
  activeKeyName: string | null;
  setActiveKeyName: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ChannelsRow = ({ activeKeyName, setActiveKeyName }: Props) => {
  const { joined } = useTwitch();

  const streams = Array.from(joined.streams.values());

  return (
    <div className="w-full bg-gray-700 flex">
      <>
        {streams.map((stream, index) => {
          return (
            <div
              key={index}
              className={`cursor-pointer w-36 ${
                activeKeyName && stream.keyName === activeKeyName
                  ? "bg-gray-500 text-white"
                  : ""
              }`}
            >
              <div className="flex flex-col">
                <div
                  onClick={() => {
                    console.log("clicked part");
                    joined.partChannel(stream.keyName);
                    setActiveKeyName(null);
                  }}
                  className="ml-auto"
                >
                  <FontAwesomeIcon className="text-white" icon={faX} />
                </div>
                <div
                  className="w-full flex p-1"
                  onClick={() => setActiveKeyName(stream.keyName)}
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
