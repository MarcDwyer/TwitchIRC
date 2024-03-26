import { IrcMessage } from "@src/twitchChat/twitch_data";
import { create } from "zustand";
import { createIRCMessage } from "../utils/createIrcMessage";
import { useCrendentialsStore } from "./credentials";
import { useWebSocketStore } from "./websocket";
import { TwitchCmds } from "../utils/twitchCmds";
import { useActiveChannelStore } from "./activeChannel";

export type Chat = {
  chatters: Set<string>;
  messages: IrcMessage[];
};
export type ChatMap = Map<string, Chat>;

type UseChatStore = {
  chatMap: ChatMap;
  addMessage: (ircMsg: IrcMessage) => void;
  sendMsg: (msg: string, channelName: string) => void;
};

export const createChat = (streamerName: string): Chat => ({
  chatters: new Set([streamerName]),
  messages: [],
});

export const MESSAGE_LIMIT = 350;

export const useChatStore = create<UseChatStore>((set, get) => ({
  chatMap: new Map(),
  addMessage: (ircMsg) =>
    set((state) => {
      const activeChanName =
        useActiveChannelStore.getState().channel?.channelName;

      const isActiveChannel = activeChanName === ircMsg.channel;

      console.log({ isActiveChannel });
      const updatedChatMap = new Map(state.chatMap);

      const chat =
        updatedChatMap.get(ircMsg.channel) ?? createChat(ircMsg.channel);

      const updatedMsgs = [...chat.messages, ircMsg];

      if (updatedMsgs.length >= MESSAGE_LIMIT) {
        //delete 50 oldest messages
        updatedMsgs.splice(0, 50);
      }

      const updatedChatters = new Set(chat.chatters);
      updatedChatters.add(ircMsg.username);

      const updatedChat = {
        messages: updatedMsgs,
        chatters: updatedChatters,
      };
      updatedChatMap.set(ircMsg.channel, updatedChat);

      return {
        chatMap: updatedChatMap,
      };
    }),
  sendMsg: (msg, channelName) =>
    set((store) => {
      const ws = useWebSocketStore.getState().ws;
      const creds = useCrendentialsStore.getState().info;
      // const setActiveMsgs = useActiveChannelStore.getState().setMessages;

      if (!creds || !ws) return store;

      const ircMsg = createIRCMessage({
        username: creds.login,
        channelName,
        message: msg,
      });
      ws.send(TwitchCmds.send(channelName, msg));
      const updatedChatMap = new Map(store.chatMap);

      const updatedChat =
        updatedChatMap.get(ircMsg.channel) ?? createChat(channelName);

      updatedChat.messages.push(ircMsg);
      // setActiveMsgs(updatedMessages.get(ircMsg.channel) as IrcMessage[]);
      updatedChatMap.set(ircMsg.channel, { ...updatedChat });
      return {
        chatMap: updatedChatMap,
      };
    }),
}));
