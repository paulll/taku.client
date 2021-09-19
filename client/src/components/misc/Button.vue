<template>
  <button @click="state.playKeystroke()" class="bg-dark-300 select-none min-w-max rounded-8px flex font-medium p-1 items-center justify-center transition-all duration-100 border-3 border-dark-300 active:bg-white-400 active:border-white-500">
    <div :class="`${text ? 'py-1 px-4' : 'p-2'} flex items-center bg-dark-300 rounded-4px justify-between gap-2 transition-all duration-100`">
      <Icon v-if="icon" class="h-6 transition-all duration-100" :icon="icon" />
      <h1 v-if="text">{{ text }}</h1>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import Icon from "./Icon.vue";
const state = useState();
defineProps<{
  text?: string;
  icon?: string;
}>();
</script>

<style scoped>
button:focus {
  outline: none;
}

a.router-link-active button,
a.router-link-active button > div {
  @apply bg-white-500;
}

button:active {
  @apply border-white-500;
}

button:hover:not(:active) {
  @apply border-dark-400;
}

button:hover > div {
  @apply bg-dark-400;
}

button:active > div {
  @apply bg-white-500 text-dark-100;
}

a.router-link-active button .icon,
button:active .icon {
  @apply filter invert;
}
</style>
