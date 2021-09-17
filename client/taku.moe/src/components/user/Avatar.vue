<template>
  <img :src="url" alt="avatar" style="aspect-ratio: 1 / 1;" class="object-contain rounded-full" />
</template>

<script setup lang="ts">
defineProps<{
  url: string;
}>();
</script>
