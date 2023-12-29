import { createPortal } from "react-dom";

type Props = {
  onClick: () => void;
};

export function ModalBackground({ onClick }: Props) {
  return createPortal(
    <div
      onClick={onClick}
      className="absolute top-0 right-0 bottom-0 left-0 border-2 overflow-hidden"
    ></div>,
    document.getElementById("root") as HTMLDivElement
  );
}
