import { useTwitch } from "../../context/twitchCtx";
import { ChannelsRow } from "./ChannelsRow";
import {
  ActiveStreamProvider,
  useActiveStream,
} from "./context/ActiveStreamCtx";

const IRCView = () => {
  const { followers } = useTwitch();
  const { activeStream } = useActiveStream();

  return (
    <>
      {followers.streams && followers.streams.length && (
        <div className="w-full h-full flex flex-col">
          {activeStream ? (
            <>
              <ChannelsRow />
              <IRCView />
            </>
          ) : null}
        </div>
      )}
    </>
  );
};

export default () => {
  return (
    <ActiveStreamProvider>
      <IRCView />
    </ActiveStreamProvider>
  );
};
