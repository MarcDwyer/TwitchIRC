export function isMentioned(username: string, message: string) {
  const words = message.split(" ");
  for (const word of words) {
    if (word[0] === "@") {
      const afterAt = word.substring(1, word.length);
      return afterAt === username;
    }
  }
  return false;
}
