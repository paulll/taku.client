<template>
  <img :src="url" alt="avatar" class="rounded-full" />
</template>

<script setup lang="ts">
defineProps<{
  url: string;
}>();
</script>
