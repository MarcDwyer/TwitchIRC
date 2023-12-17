class Node {
  constructor(public char: string | null) {}
  isEnd = false;
  children: Record<string, Node> = {};
}

const depthLimit = 10;

export class Trie {
  root = new Node(null);

  insert(word: string) {
    let current = this.root;

    for (const char of word) {
      if (!(char in current.children)) {
        current.children[char] = new Node(char);
      }
      current = current.children[char];
    }
    current.isEnd = true;
  }
  search(word: string) {
    let lastNode = this.root;
    let lastWord = "";
    for (const char of word) {
      if (!(char in lastNode.children)) {
        break;
      }
      lastWord += char;
      lastNode = lastNode.children[char];
    }
    return this.getRecommendations(lastNode, [], 0, lastWord, true);
  }
  getRecommendations(
    node: Node,
    list: string[],
    limit: number,
    word: string,
    isStarting: boolean
  ) {
    if (!isStarting) {
      word += node.char;
    }
    if (node.isEnd) {
      list.push(word);
    }
    if (limit >= depthLimit) return list;
    limit++;
    for (const childNode of Object.values(node.children)) {
      this.getRecommendations(childNode, list, limit, word, false);
    }
    return list;
  }
}
// "ro"

// -> r -> o