<template>
  <div class="root">
    <textarea name="editor" id="editor" cols="30" rows="10" v-model="rawText"></textarea>
    <iframe src="/preview" frameborder="0" ref="preview"></iframe>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data: {
    rawText: ""
  }
});
</script>
<style scoped>
.root > * {
    flex: 1;
    flex-basis: 300px;
}
.root {
    display: flex;
    flex-flow: row wrap;
    flex: 1;
}
</style>
