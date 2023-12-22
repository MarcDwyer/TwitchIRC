import { IrcMessage } from "@src/twitchChat/twitch_data";
import { create } from "zustand";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useCrendentialsStore } from "./credentials";
import { useWebSocketStore } from "./websocket";
import { TwitchCmds } from "../utils/twitchCmds";
import { useActiveChannelStore } from "./activeChannel";

type UseMessageStore = {
  messages: Map<string, IrcMessage[]>;
  addMessage: (ircMsg: IrcMessage) => void;
  sendMsg: (msg: string, channelName: string) => void;
};

const MESSAGE_LIMIT = 350;

export const useMessagesStore = create<UseMessageStore>((set) => ({
  messages: new Map(),
  addMessage: (ircMsg) =>
    set((store) => {
      const { channel: activeChan, setMessages } =
        useActiveChannelStore.getState();
      const isActive = activeChan?.channelName === ircMsg.channel;
      const updatedMessages = new Map(store.messages);
      const messages = [...(store.messages.get(ircMsg.channel) ?? []), ircMsg];
      if (messages.length >= MESSAGE_LIMIT) {
        messages.splice(0, 50);
      }
      updatedMessages.set(ircMsg.channel, messages);
      if (isActive) {
        setMessages(messages);
      }
      return {
        messages: updatedMessages,
      };
    }),
  sendMsg: (msg, channelName) =>
    set((store) => {
      const ws = useWebSocketStore.getState().ws;
      const creds = useCrendentialsStore.getState().info;

      if (!creds || !ws) return store;

      const ircMsg = createIRCMessage({
        username: creds.login,
        channelName,
        message: msg,
      });
      ws.send(TwitchCmds.send(channelName, msg));
      const updatedMessages = new Map(store.messages);
      updatedMessages.set(ircMsg.channel, [
        ...(store.messages.get(ircMsg.channel) ?? []),
        ircMsg,
      ]);
      return {
        messages: updatedMessages,
      };
    }),
}));
