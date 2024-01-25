export function insertTag(
  completeTag: string,
  startOfTag: number,
  msg: string,
  searchTag: string
): [string, number] {
  let insertedMsg = "";

  let endOfTagPos = -1;
  console.log(msg[startOfTag]);
  for (let i = 0; i < msg.length; ) {
    if (i === startOfTag) {
      for (let j = 0; j < completeTag.length; j++) {
        insertedMsg += completeTag[j];
      }
      console.log({ startOfTag, completeTag });
      // endOfTag seems correct... something else is repositioning cursor
      endOfTagPos = startOfTag + completeTag.length - 1;
      i += searchTag.length;
    } else {
      insertedMsg += msg[i];
      i++;
    }
  }
  return [insertedMsg, endOfTagPos];
}
