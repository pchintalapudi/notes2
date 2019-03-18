<template>
  <div class="home">
    <cube-logo/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CubeVue from "./Cube.vue";
export default Vue.extend({
  name: "home",
  components: { "cube-logo": CubeVue }
});
</script>
