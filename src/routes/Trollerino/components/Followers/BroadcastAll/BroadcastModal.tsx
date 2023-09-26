import { Deferred } from "@src/utils/async/deferred";
import { Modal, Button } from "flowbite-react";
import { useState } from "react";

type Props = {
  signal: Deferred<string>;
  open: boolean;
};

export const BroadcastModal = ({ signal, open }: Props) => {
  const [message, setMessage] = useState("");

  return (
    <Modal
      position="center"
      show={open}
      onClose={() => {
        signal.reject();
      }}
      className="text-white"
    >
      <Modal.Header as={"span"} className="bg-gray-700">
        <span className="text-white">What would you like to broadcast?</span>
      </Modal.Header>
      <Modal.Body className="bg-gray-700 text-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signal.resolve(message);
            setMessage("");
          }}
        >
          <input
            className="p-2 mb-3 w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="ml-auto" type="submit">
            Submit
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
