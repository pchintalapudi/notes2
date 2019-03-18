<template>
  <div>
      <dual-edit></dual-edit>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import DualEditorVue from "../components/editor/DualEditor.vue";
export default Vue.extend({
  components: { "dual-edit": DualEditorVue }
});
</script>
