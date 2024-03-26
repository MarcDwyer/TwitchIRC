import { MutableRefObject, createContext, useContext, useRef } from "react";
import { ChatMap, createChat } from "../stores/chat";
import { IrcMessage } from "@src/twitchChat/twitch_data";

type ChatContextProps = {
  chatData: MutableRefObject<ChatMap>;
};
//@ts-ignore
const ChatContext = createContext<ChatContextProps>();

type Props = {
  children: React.ReactNode;
};

export function ChatProvider({ children }: Props) {
  const chatData = useRef<ChatMap>(new Map());
  return (
    <ChatContext.Provider value={{ chatData }}>{children}</ChatContext.Provider>
  );
}
export function useChatRef() {
  const { chatData } = useContext(ChatContext);
  return { chatData };
}

const MESSAGE_LIMIT = 350;

export function useChatRefActions() {
  const { chatData } = useChatRef();

  const addMsg = (ircMsg: IrcMessage) => {
    const channel =
      chatData.current.get(ircMsg.channel) ?? createChat(ircMsg.channel);

    channel.messages.push(ircMsg);
    if (channel.messages.length >= MESSAGE_LIMIT) {
      channel.messages.splice(0, 50);
    }
    chatData.current.set(ircMsg.channel, channel);

    return channel;
  };

  return { addMsg };
}
