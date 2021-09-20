<template>
  <div :style="`background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), url(${url|| state.defaultBanner});`" alt="Profile Banner" class="w-full bg-no-repeat bg-cover bg-center" />
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
const state = useState();
defineProps<{ url?: string }>();
</script>
