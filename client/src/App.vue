<template>
  <router-view class="router-view" :style="theme"/>
</template>
<script lang="ts">
import Vue from "vue";
import { themeStringifier } from "./theme";
export default Vue.extend({
  computed: {
    theme: function() {
      return themeStringifier(this.$store.state.theme.theme);
    }
  }
});
</script>
<style>
body:not(.preview) * {
  box-sizing: border-box;
  display: flex;
}
.router-view {
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

  --bg-mprimary: rgba(var(--c-bg-mprimary));
  --bg-mcontrast: rgba(var(--c-bg-mcontrast));

  --bg-tprimary: rgba(var(--c-bg-primary), var(--n-hov-transp));
  --bg-tcontrast: rgba(var(--c-bg-contrast), var(--n-hov-transp));
}
.router-view {
  height: 100%;
  width: 100%;
  color: var(--bg-contrast);
}
* {
  margin: 0;
  padding: 0;
  border-style: none;
  background-color: var(--bg-primary);
}
html,
body {
  height: 100%;
  width: 100%;
}
</style>
