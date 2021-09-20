<script setup lang="ts">
import Navigation from "./components/global/Navigation.vue";
import DebugHeader from "./components/global/DebugHeader.vue";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <div class="flex flex-col h-full w-full text-white-500">
    <DebugHeader /> 
    <div class="flex h-full w-full">
      <Navigation />
      <router-view />
    </div>
  </div>
</template>

<style>
*::-webkit-scrollbar {
  width: 9px;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
*::-webkit-scrollbar-thumb {
  @apply bg-dark-400;
  border-radius: 20px;
  border: transparent;
}
</style>
