import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { joinedState } from "@src/routes/Trollerino/atoms/joined";
import { activeChannelState } from "@src/routes/Trollerino/atoms/activeChannel";
import { ircSocketState } from "@src/routes/Trollerino/selectors/twitchChat";
import { messagesState } from "@src/routes/Trollerino/atoms/messages";

export const ChannelsRow = () => {
  const [joined, setJoined] = useRecoilState(joinedState);
  const [activeChannel, setActiveChannel] = useRecoilState(activeChannelState);
  const [, setMessages] = useRecoilState(messagesState);
  const ws = useRecoilValue(ircSocketState);

  const streams = Array.from(joined.values());

  return (
    <div className="w-full bg-gray-700 flex h-16">
      <>
        {streams.map((stream, index) => {
          const mentioned =
            stream.mentioned &&
            stream.channelName !== activeChannel?.channelName;
          return (
            <div
              key={index}
              className={`cursor-pointer w-32 ${
                activeChannel &&
                stream.channelName === activeChannel?.channelName
                  ? "bg-gray-500 text-white"
                  : ""
              } ${mentioned ? "bg-orange-500" : ""}`}
            >
              <div className="flex flex-col">
                <div
                  onClick={() => {
                    // part
                    if (ws) {
                      ws.send(`PART ${stream.channelName}`);
                    }
                    setJoined((currJoined) => {
                      const updatedJoined = new Map(currJoined);
                      updatedJoined.delete(stream.channelName);
                      return updatedJoined;
                    });
                    setMessages((currMessages) => {
                      const updatedMsgs = new Map(currMessages);
                      updatedMsgs.delete(stream.channelName);
                      return updatedMsgs;
                    });
                  }}
                  className="ml-auto"
                >
                  <FontAwesomeIcon className="text-white" icon={faX} />
                </div>
                <div
                  className="w-full flex p-2"
                  onClick={() => {
                    // set active channel
                    setActiveChannel(stream);
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
