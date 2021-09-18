<template>
  <img :src="url || state.defaultAvatar" alt="avatar" style="aspect-ratio: 1 / 1;" class="object-contain rounded-full" />
</template>

<script setup lang="ts">
import state from "../../services/state";
defineProps<{
  url?: string;
}>();
</script>
