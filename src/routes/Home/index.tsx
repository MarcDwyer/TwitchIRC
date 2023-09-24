import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { OAuthURL } from "../../utils/oauth";

export default function Homepage() {
  return (
    <a
      className="flex m-auto bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      href={OAuthURL}
    >
      <FontAwesomeIcon icon={faTwitch} className="m-auto mr-1" />
      <span className="mt-auto mr-5">Connect to Twitch</span>
    </a>
  );
}
