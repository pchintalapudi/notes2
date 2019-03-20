<template>
  <preview-viewer/>
</template>
<script lang="ts">
import Vue from "vue";
import PreviewVue from "../components/editor/Preview.vue";
export default Vue.extend({
  components: { "preview-viewer": PreviewVue }
});
</script>
