<template>
  <header class="bg-dark-100 flex items-center justify-end px-2 gap-4 w-full h-8">{{ FPS }}FPS</header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const FPS = ref(0);

let lastLoop = new Date().getTime();
let collectedFps: number;

const frameRequest = (timestamp: number) => {
  let thisLoop = new Date().getTime();
  let fps = Math.floor(1000 / (thisLoop - lastLoop));
  lastLoop = thisLoop;
  collectedFps = fps;
  window.requestAnimationFrame(frameRequest);
};

setInterval(() => (FPS.value = collectedFps), 1000);

window.requestAnimationFrame(frameRequest);
</script>
