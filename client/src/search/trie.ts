class ImmutableTrie {
  edges: Map<string, ImmutableTrie> = new Map();
  constructor(public end: boolean) {}

  traverse(key: string): ImmutableTrie | null {
    if (!key) return this;
    let trie = this.edges.get(key[0]);
    return trie ? trie.traverse(key.substring(1)) : null;
  }

  present(key: string) {
    let trie = this.traverse(key);
    return trie && trie.end;
  }

  items(): string[][] {
    let items: string[][] = [];
    this.edges.forEach((t, k) => {
      items.push(
        ...t.items().map(sarr => {
          sarr.push(k);
          return sarr;
        })
      );
    });
    if (this.end) items.push([]);
    return items;
  }
}

export default ImmutableTrie;
