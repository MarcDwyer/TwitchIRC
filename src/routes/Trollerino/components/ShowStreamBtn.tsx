import { useShallow } from "zustand/react/shallow";
import { useActiveChannelStore } from "../stores/activeChannel";
import { PurpleBtn } from "@src/components/PurpleBtn";

export function ShowStream() {
  const { activeChannel, show, setShow } = useActiveChannelStore(
    useShallow((store) => ({
      activeChannel: store.channel,
      show: store.showStream,
      setShow: store.setShowStream,
    }))
  );

  if (!activeChannel) {
    return null;
  }

  const streamName = activeChannel?.streamData.user_name;
  const text = `${show ? "Hide" : "Show"} ${streamName}'s stream?`;
  return (
    <div className="w-full flex m-5">
      <div className="mr-auto mt-auto mb-auto">
        <PurpleBtn onClick={() => setShow(!show)} text={text} />
      </div>
    </div>
  );
}
