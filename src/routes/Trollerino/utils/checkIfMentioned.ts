export const checkIfMentioned = (
  message: string,
  username: string
): boolean => {
  message = message.toLowerCase();

  for (let i = 0; i < message.length; i++) {
    if (message[i] === "@") {
      const substr = message.substring(i + 1, i + 1 + username.length);
      if (substr === username) {
        return true;
      }
      i = i + substr.length;
    }
  }
  return false;
};
