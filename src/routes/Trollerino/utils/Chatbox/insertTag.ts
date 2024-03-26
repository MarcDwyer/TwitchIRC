type InserTagParams = {
  completeTag: string;
  startOfTag: number;
  msg: string;
  searchTag: string;
};
export function insertTag({
  completeTag,
  startOfTag,
  msg,
  searchTag,
}: InserTagParams): [string, number] {
  let insertedMsg = "";

  let endOfTagPos = -1;

  for (let i = 0; i < msg.length; ) {
    if (i === startOfTag) {
      for (let j = 0; j < completeTag.length; j++) {
        insertedMsg += completeTag[j];
      }
      endOfTagPos = startOfTag + completeTag.length - 1;
      i += searchTag.length;
    } else {
      insertedMsg += msg[i];
      i++;
    }
  }
  return [insertedMsg, endOfTagPos];
}
