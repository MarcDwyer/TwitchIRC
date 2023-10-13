import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  href: string;
  text: string;
  classNames?: string;
};

export function TwitchLink({ href, text, classNames = "" }: Props) {
  return (
    <a
      className={
        "bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" +
        ` ${classNames}`
      }
      href={href}
      target="_blank"
    >
      <FontAwesomeIcon icon={faTwitch} className="m-auto mr-1" />
      <span className="mt-auto mr-5">{text}</span>
    </a>
  );
}
