<template>
  <aside>
    <tab-head v-for="file in open" :key="file.id" :file="file"></tab-head>
  </aside>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  components: { "tab-head": () => import("./Tab.vue") },
  computed: {
    open: function() {
      return this.$store.state.files.open;
    }
  }
});
</script>
