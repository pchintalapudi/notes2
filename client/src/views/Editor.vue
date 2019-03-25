<template>
  <main class="main">
    <nav class="tree"></nav>
    <section v-if="editing" class="editing">
      <tab-row></tab-row>
      <dual-edit/>
    </section>
  </main>
</template>
<script lang="ts">
import Vue from "vue";
import { FileType, NotePayload } from "../files";
export default Vue.extend({
  components: {
    "dual-edit": () => import("../components/editor/DualEditor.vue"),
    "tab-row": () => import("../components/editor/Tabs.vue")
  },
  mounted: function() {
    let file = {
      title: "Test",
      date: new Date(),
      type: FileType.NOTE,
      parent: undefined,
      id: 0,
      payload: new NotePayload()
    };
    this.$store.commit("files/setRootFile", file);
    this.$store.commit("files/open", file);
  },
  computed: {
    editing: function(): boolean {
      return !!this.$store.state.files.editing;
    }
  }
});
</script>
<style scoped>
.main {
  height: 100%;
  display: flex;
}
.tree {
  flex: 0.25;
}
.editing {
  flex: 0.75;
  flex-flow: column nowrap;
}
.editing:first-child {
  flex: 0.1;
  flex-basis: 2em;
  flex-flow: row nowrap;
  overflow: auto;
}
.editing > :last-child {
  flex: 1;
}
</style>
