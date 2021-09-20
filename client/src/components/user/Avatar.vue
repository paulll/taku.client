<template>
  <img :src="`${api.backendURL}/${url}` || state.defaultAvatar" alt="avatar" style="aspect-ratio: 1 / 1" class="object-contain rounded-full" />
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import api from "../../services/api";
const state = useState();
defineProps<{
  url?: string;
}>();
</script>
