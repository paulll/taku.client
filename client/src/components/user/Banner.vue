<template>
  <div :style="`background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), url(${api.backendURL}/${url});`" alt="Profile Banner" class="w-full bg-no-repeat bg-cover bg-center" />
</template>

<script setup lang="ts">
import api from "../../services/api";
defineProps<{ url: string }>();
</script>
