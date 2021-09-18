<template>
  <button class="rounded-4px flex font-medium items-center p-2 justify-center transition-all duration-100 border-0px active:bg-pink-400 hover:bg-pink-300">
    <div class="flex items-center justify-between gap-2 ">
      <Icon v-if="icon" :icon="icon"/>
      <h1 v-if="text">{{ text }}</h1>
    </div>
  </button>
</template>

<script setup lang="ts">
import Icon from "./Icon.vue";
defineProps<{ 
  text?: string;
  icon?: string;
}>();
</script>
