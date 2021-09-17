<template>
  <img :src="url" alt="Cum" class="rounded-full">
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>();
</script>