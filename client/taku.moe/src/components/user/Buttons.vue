<template>
  <div class="flex flex-col h-full py-2 gap-12">
    <div class="top">
      <h1 class="text-5xl font-semibold">{{ user.username }}</h1>
    </div>
    <div class="bottom flex gap-4 items-center">
      <Button icon="edit" text="Edit" />
      <h1>{{ user.email }}</h1>
      <h1>{{ new Date(user.created_at).toLocaleString() }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../services/types";
import Button from "../misc/Button.vue";
defineProps<{
  user: User;
}>();
</script>
