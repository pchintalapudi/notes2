<template>
  <div class="container" style="--logo-width:37.5vmin">
    <div class="cube" @click="clickMe">
      <div class="back"></div>
      <div class="right"></div>
      <div class="left"></div>
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="front"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    clickMe:function() {
      this.$emit('logo-click');
      console.log('huh it actually worked.')
    }
  }
})
</script>
<style>
.container {
  perspective: calc(var(--logo-width) * 4);
  perspective-origin: 50% calc(var(--logo-width) / 2);
  width: 100%;
  position: relative;
}
.container,
.cube,
.cube > div {
  display: block;
  box-sizing: border-box;
}
.cube {
  position: absolute;
  width: var(--logo-width);
  height: var(--logo-width);
  transform-style: preserve-3d;
  transform-origin: center center calc(var(--logo-width) / 2);
  transform: rotateX(35.26deg) rotateZ(45deg);
  top: calc(50vh - var(--logo-width) / 4 * 3);
  left: calc(50vw - var(--logo-width) / 2);
}
.cube > div {
  position: absolute;
  width: var(--logo-width);
  height: var(--logo-width);
  background-color: var(--focus-sel);
  cursor: pointer;
  border: 1px solid var(--bg-tprimary);
}
.cube:hover > div {
  background-color: var(--focus-hov);
}
.cube:active > div {
  background-color: var(--focus-act);
}
.back {
  transform: rotateY(180deg);
}
.right {
  transform: rotateY(-270deg);
  transform-origin: top right;
}
.left {
  transform: rotateY(270deg);
  transform-origin: center left;
}
.top {
  transform: rotateX(-90deg) translateY(calc(-1 * var(--logo-width)));
  transform-origin: top center;
}
.bottom {
  transform: rotateX(90deg) translateY(var(--logo-width));
  transform-origin: bottom center;
}
.front {
  transform: translateZ(var(--logo-width));
}
</style>
