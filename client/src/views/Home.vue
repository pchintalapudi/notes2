<template>
  <cube-logo v-on:logo-click="goToEditor"/>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "home",
  components: { "cube-logo": () => import("./Cube.vue") },
  methods: {
    goToEditor: function() {
      window.location.pathname = "editor";
    }
  }
});
</script>
