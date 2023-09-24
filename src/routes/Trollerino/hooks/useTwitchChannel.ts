import { Channel } from "@src/twitchChat/channel";
import { IrcMessage } from "@src/twitchChat/twitch_data";
import { useEffect, useState } from "react";

export const useTwitchChannel = (channel: Channel) => {
  const [messages, setMessages] = useState<IrcMessage[]>([]);

  const part = () => {
    if (!channel) {
      throw new Error("No channel to part with");
    }
    channel.part();
  };

  const sendMsg = (msg: string) => {
    if (!channel) {
      throw new Error("No channel to part with");
    }
    channel.send(msg);
  };

  useEffect(() => {
    channel.addEventListener("privmsg", (msg) => {
      setMessages([msg, ...messages]);
    });
    return function () {
      channel.part();
    };
  }, [channel]);

  return {
    channel,
    part,
    sendMsg,
  };
};
