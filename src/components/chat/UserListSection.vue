<template>
  <h1 v-if="users.length !== 0" class="ml-1" >{{name}}</h1>
  <div class="flex p-1 cursor-pointer rounded-4px gap-2 items-center hover:bg-dark-200" v-for="user of users" :key="user._id">
    <UserButton :user="user" />
  </div>
</template>

<script setup lang="ts">
import { User } from "../../services/types";
import UserButton from "./UserButton.vue";
defineProps<{ name: string, users: User[] }>();
</script>