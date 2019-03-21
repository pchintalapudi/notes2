<template>
  <cube-logo v-on:logo-click="goToEditor"/>
</template>

<script lang="ts">
import Vue from "vue";
import CubeVue from "./Cube.vue";
export default Vue.extend({
  name: "home",
  components: { "cube-logo": CubeVue },
  methods: {
    goToEditor: function() {
      window.location.pathname = "editor";
    }
  }
});
</script>
