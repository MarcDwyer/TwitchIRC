import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  text: string;
  onClick?: () => void;
};
export function PurpleBtn({ text, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
    >
      <FontAwesomeIcon icon={faTwitch} className="m-auto mr-1" />
      <span className="mt-auto mr-5">{text}</span>
    </button>
  );
}
