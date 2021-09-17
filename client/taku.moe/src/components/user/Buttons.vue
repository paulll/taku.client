<template>
  <div class="flex mt-4 gap-6 items-center font-semibold">
    <h1 class="text-5xl" >{{user.username}}</h1>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../services/api";
defineProps<{
  user: User
}>();
</script>