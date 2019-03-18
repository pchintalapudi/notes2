<template>
  <div class="container" style="--logo-width:50vmin">
    <div class="cube">
      <div class="back"></div>
      <div class="right"></div>
      <div class="left"></div>
      <div class="top"></div>
      <div class="bottom"></div>
      <div class="front"></div>
    </div>
  </div>
</template>
<style>
.container {
  perspective: calc(var(--logo-width) * 4);
  perspective-origin: 50% calc(var(--logo-width) / 2);
}
.container, .cube, .cube>div {
  display: block;
}
.cube {
  position: relative;
  width: var(--logo-width);
  height: var(--logo-width);
  transform-style: preserve-3d;
}
.cube > div {
  position: absolute;
  width: var(--logo-width);
  height: var(--logo-width);
  background-color: var(--sel-transp);
  cursor: pointer;
}
.cube:hover > div {
  background-color: var(--hov-transp);
}
.cube:active > div {
  background-color: var(--act-transp);
}
.back {
  transform: translateZ(-100px) rotateY(180deg);
}
.right {
  transform: rotateY(-270deg) translateX(100px);
  transform-origin: top right;
}
.left {
  transform: rotateY(270deg) translateX(-100px);
  transform-origin: center left;
}
.top {
  transform: rotateX(-90deg) translateY(-100px);
  transform-origin: top center;
}
.bottom {
  transform: rotateX(90deg) translateY(100px);
  transform-origin: bottom center;
}
.front {
  transform: translateZ(100px);
}
</style>
