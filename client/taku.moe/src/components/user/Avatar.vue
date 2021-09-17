<template>
  <img :src="url" alt="avatar" class="rounded-full w-40 h-40 border-4 border-dark-100">
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>();
</script>