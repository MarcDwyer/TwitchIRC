import { OAuthURL } from "../../utils/oauth";
import { TwitchLink } from "@src/components/TwitchLink";

export default function Homepage() {
  return (
    <div className="m-auto">
      <TwitchLink href={OAuthURL} text="Connect to Twitch" />
    </div>
  );
}
