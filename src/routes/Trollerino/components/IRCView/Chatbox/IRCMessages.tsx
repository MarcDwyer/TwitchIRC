import { IrcMessage } from "@src/twitchChat/twitch_data";

type Props = {
  messages: IrcMessage[];
};

export function IRCMessages({ messages }: Props) {
  return (
    <div className="overflow-y-auto m-auto w-11/12 overflow-x-hidden mt-5 mb-5 h-full">
      {messages.map((message, index) => {
        const color = message.tags.color;
        return (
          <div key={index} className="mb-2">
            <strong
              style={{
                color,
              }}
            >
              {message.username}:{" "}
            </strong>
            {message.message}
          </div>
        );
      })}
    </div>
  );
}
