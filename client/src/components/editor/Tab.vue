<template>
  <h3 class="root" @click="editFile">
    <div :class="classes" tabindex="0">
      <p class="title">{{title}}</p>
      <p v-if="saved" class="saved">⋅</p>
    </div>
    <p class="close" @click="close" tabindex="0">&times;</p>
  </h3>
</template>
<script lang="ts">
import Vue from "vue";
import { TextNote } from "../../files";
export default Vue.extend({
  props: { file: Object as () => TextNote },
  computed: {
    title: function() {
      return this.file.title;
    },
    saved: function() {
      return this.file.payload.saved;
    },
    selected: function() {
      return this.file === this.$store.state.files.editing;
    },
    classes: function() {
      let classes = ["title"];
      if (this.selected) classes.push("selected");
      return classes;
    }
  },
  methods: {
    editFile: function() {
      this.$store.commit("files/open", this.file);
    },
    close: function() {
      this.$store.commit("files/close", this.file);
    }
  }
});
</script>
<style scoped>
.root {
  display: flex;
  flex-flow: row nowrap;
  padding: 1px;
}
.root:hover {
  padding: 0;
  border: 1px solid var(--focus-primary);
}
.title {
  flex: 1;
}
.close,
.title-button {
  background-color: transparent;
  transition: background-color 300ms;
}
.title-button:hover {
  background-color: var(--focus-hov);
}
.close:hover {
  background-color: var(--cfocus-hov);
}
.title-button:active {
  background-color: var(--focus-act);
}
.close:active {
  background-color: var(--cfocus-act);
}
</style>
