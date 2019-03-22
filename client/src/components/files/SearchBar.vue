<template>
  <section>
    <input type="search" name="search-bar" id="search-bar" v-model="searched">
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import { ImmutableTrie } from "../../search";
export default Vue.extend({
  data: function() {
    return { searched: "" };
  },
  computed: {
    results: function() {
      let titleTrie: ImmutableTrie | undefined = undefined,
        trie = titleTrie!;
      let trieNode = trie.traverse(this.searched);
      if (trieNode) {
        let results = trieNode.items();
        return results.slice(0, 10);
      }
      return [];
    }
  }
});
</script>
