import { Deferred } from "@src/utils/async/deferred";
import { Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";

type Props = {
  signal: Deferred<string>;
  open: boolean;
};

export const BroadcastModal = ({ signal, open }: Props) => {
  const [message, setMessage] = useState("");

  console.log(signal.state);
  return (
    <Modal
      className="flex border-2"
      show={open}
      onClose={() => {
        signal.reject();
      }}
    >
      <Modal.Body className="m-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signal.resolve(message);
          }}
        >
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
        </form>
      </Modal.Body>
    </Modal>
  );
};
