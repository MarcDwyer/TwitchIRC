import { Modal, Button } from "flowbite-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onSubmit: (message: string) => void;
  closeModal: () => void;
};

export const BroadcastModal = ({ closeModal, open, onSubmit }: Props) => {
  const [message, setMessage] = useState("");

  return (
    <Modal
      onClose={closeModal}
      position="center"
      show={open}
      className="text-white"
    >
      <Modal.Header as={"span"} className="bg-gray-700">
        <span className="text-white">What would you like to broadcast?</span>
      </Modal.Header>
      <Modal.Body className="bg-gray-700 text-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(message);
            closeModal();
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
