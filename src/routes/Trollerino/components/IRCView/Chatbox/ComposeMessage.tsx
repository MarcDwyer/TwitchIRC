import { useState } from "react";
import { useActiveStreamActions } from "../context/ActiveStreamCtx";

export function ComposeMessage() {
  const { sendMsg } = useActiveStreamActions();
  const [newMessage, setNewMessage] = useState("");

  return (
    <form
      className="flex h-42"
      onSubmit={(e) => {
        e.preventDefault();
        sendMsg(newMessage);
        setNewMessage("");
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-5 rounded-l-md text-black"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}
