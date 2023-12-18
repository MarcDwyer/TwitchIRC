import { BroadcastAll } from "../BroadcastAll";
import { ConnectAgain } from "../ConnectAgain";
import { Followers } from "../Followers";

export function Nav() {
  return (
    <div className="flex flex-col bg-gray-800 w-48 flex-none">
      <BroadcastAll />
      <Followers />
      <ConnectAgain />
    </div>
  );
}
