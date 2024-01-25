import { useShallow } from "zustand/react/shallow";
import { useActiveChannelStore } from "../../stores/activeChannel";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function TwitchStream() {
  const { activeChannel, show, setShowStream } = useActiveChannelStore(
    useShallow((store) => ({
      activeChannel: store.channel,
      show: store.showStream,
      setShowStream: store.setShowStream,
    }))
  );
  const hide = () => setShowStream(false);
  const display = () => setShowStream(true);

  const height = show ? "h-2/4" : "h-16";

  return (
    <div className={`w-full flex relative ${height}`}>
      {activeChannel &&
        (() => {
          const streamUser = activeChannel.streamData.user_name;
          const onClick = show ? hide : display;
          return (
            <>
              <div
                onClick={onClick}
                className="absolute top-2 left-2 z-20 w-20 flex cursor-pointer"
              >
                <FontAwesomeIcon
                  size={"2x"}
                  icon={faTwitch}
                  className={`m-auto ${
                    show ? "text-rose-700" : "text-indigo-600"
                  }`}
                />
              </div>
              {show && (
                <iframe
                  className="w-full h-full"
                  src={`https://player.twitch.tv/?channel=${streamUser}&parent=streamernews.example.com&muted=true`}
                />
              )}
            </>
          );
        })()}
    </div>
  );
}
