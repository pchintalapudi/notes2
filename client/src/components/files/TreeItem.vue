<template>
  <article @click="open = !open">
    <h4>{{title}}</h4>
    <time :datetime="date.toString()"></time>
    <div v-if="children && open" @click.stop>
      <tree-item v-for="child in children" :key="child.id" :file="child"></tree-item>
    </div>
  </article>
</template>
<script lang="ts">
import Vue from "vue";
import { FileBase, FileType, NoteFolder } from "../../files";
export default Vue.extend({
  props: {
    file: Object as () => FileBase
  },
  data: function() {
    return { open: false };
  },
  computed: {
    title: function(): string {
      return this.file.title;
    },
    date: function(): Date {
      return this.file.date;
    },
    dateString: function(): string {
      return (this.date as Date).toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      });
    },
    children: function(): FileBase[] | null {
      return this.file.type === FileType.FOLDER
        ? (this.file as NoteFolder).children
        : null;
    }
  },
  name: "tree-item"
});
</script>
