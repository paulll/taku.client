<template>
  <button
    @click="state.playKeystroke()"
    class="whitespace-nowrap select-none min-w-max p-2 rounded-4px flex font-medium items-center justify-center transition-all duration-100 active:bg-white-500"
  >
    <Icon v-if="icon" class="h-full transition-all duration-100" :icon="icon" />
  </button>
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import Icon from "./Icon.vue";
const state = useState();
defineProps<{
  icon?: string;
}>();
</script>

<style scoped>
button:focus {
  outline: none;
}

button:active .icon {
  @apply filter invert;
}
</style>
