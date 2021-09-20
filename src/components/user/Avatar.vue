<template>
  <img :src="url || state.defaultAvatar" alt="avatar" style="aspect-ratio: 1 / 1" class="object-cover rounded-full" />
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
const state = useState();
defineProps<{
  url?: string;
}>();
</script>
