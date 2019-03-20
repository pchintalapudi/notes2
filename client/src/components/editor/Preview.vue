<template>
  <div v-html="html"></div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: function() {
    return { html: "" };
  },
  mounted: function() {
    try {
      this.html = localStorage.getItem("temp") || "";
    } catch {}
    document.body.classList.add("preview");
    window.onmessage = (event: MessageEvent) => {
      switch (event.data.type) {
        case "theme":
          this.$store.commit("theme/setTheme", event.data.theme);
          break;
        case "html":
          this.html = event.data.html;
          break;
      }
    };
  },
  beforeDestroy: function() {
    window.onmessage = null;
    document.body.classList.remove("preview");
  }
});
</script>
<style>
hr {
  background-color: var(--bg-contrast);
  height: 1px;
}
* {
  background-color: transparent;
}
</style>
