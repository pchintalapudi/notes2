<template>
  <div class="padder">
    <preview-viewer/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import PreviewVue from "../components/editor/Preview.vue";
export default Vue.extend({
  components: { "preview-viewer": PreviewVue }
});
</script>
<style scoped>
.padder {
  padding: 10px;
  box-sizing: border-box;
}
</style>

