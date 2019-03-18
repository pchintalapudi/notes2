<template>
  <router-view/>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
<style>
body * {
  box-sizing: border-box;
  display: flex;
}
:root {
  --bg-primary: rgb(var(--c-bg-primary));
  --bg-contrast: rgb(var(--c-bg-contrast));
  --focus-primary: rgb(var(--c-focus-primary));
  --focus-contrast: rgb(var(--c-focus-contrast));

  --focus-sel: rgba(var(--c-focus-primary), var(--n-sel-transp));
  --focus-hov: rgba(var(--c-focus-primary), var(--n-hov-transp));
  --focus-act: rgba(var(--c-focus-primary), var(--n-act-transp));

  --cfocus-sel: rgba(var(--c-focus-contrast), var(--n-sel-transp));
  --cfocus-hov: rgba(var(--c-focus-contrast), var(--n-hov-transp));
  --cfocus-act: rgba(var(--c-focus-contrast), var(--n-act-transp));
}
</style>
