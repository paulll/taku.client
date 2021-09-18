<template>
  <img class="h-full w-full min-h-8 max-h-8 min-w-8 max-w-8" :src="`/icons/${icon}.svg`" style="aspect-ratio: 1 / 1;" :alt="icon">
</template>

<script setup lang="ts">
defineProps<{ icon: string }>();
</script>
