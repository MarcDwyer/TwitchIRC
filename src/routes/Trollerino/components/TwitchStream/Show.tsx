import { PurpleBtn } from "@src/components/PurpleBtn";
import { JoinedValue } from "../../stores/joined";

type Props = {
  activeChannel: JoinedValue;
  hide: () => void;
};

export function Show({ activeChannel, hide }: Props) {
  return (
    <>
      <PurpleBtn
        text={`Hide ${activeChannel.streamData.user_name}'s stream`}
        onClick={hide}
      />
      <iframe
        className="w-full h-full"
        src={`https://player.twitch.tv/?channel=${activeChannel.streamData.user_login}&parent=google.com&muted=true`}
      />
    </>
  );
}
