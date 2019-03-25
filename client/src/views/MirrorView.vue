<template>
  <div class="padder">
    <preview-viewer/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  components: {
    "preview-viewer": () => import("../components/editor/Preview.vue")
  }
});
</script>
<style scoped>
.padder {
  padding: 10px;
  box-sizing: border-box;
}
</style>

