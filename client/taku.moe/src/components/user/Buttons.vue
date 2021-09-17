<template>
  <div class="flex flex-col h-full py-4 justify-between gap-6 font-semibold">
    <div class="top">
      <h1 class="text-5xl" >{{user.username}}</h1>
    </div>
    <div class="bottom">
      <Button icon="edit" text="Edit"  />
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from "../../services/api";
import Button from "../misc/Button.vue";
defineProps<{
  user: User
}>();
</script>