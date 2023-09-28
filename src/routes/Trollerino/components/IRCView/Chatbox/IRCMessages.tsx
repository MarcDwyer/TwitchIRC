import { JoinedValue } from "../../../reducers/JoinedReducer";

type Props = {
  activeStream: JoinedValue;
};

export function IRCMessages({ activeStream }: Props) {
  return (
    <div className="h-5/6 w-5/6 overflow-y-auto m-auto border-2">
      {activeStream.messages.map((message, index) => {
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
