<template>
  <div class="flex gap-2 max-w-full items-start">
    <MiniProfile :user="state.getUser(message.author_id)">
      <Avatar class="w-8 h-8 min-w-8 min-h-8 mt-1" :url="state.getUser(message.author_id)?.profileImage" />
    </MiniProfile>
    <div class="flex flex-col">
      <div class="flex gap-2 items-center">
        <router-link class="username" :to="{ name: 'user', params: { uuid: state.getUser(message.author_id)?._id } }">
          <p class="text-orange-500 font-semibold">{{ state.getUser(message.author_id)?.username }}</p>
        </router-link>
        <p class="text-sm text-dark-500">{{ new Date(message.created_at).toLocaleTimeString() }}</p>
      </div>
      <h1 class="content">{{ message.content }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import { IMessage } from "../../services/types";

import Avatar from "../../components/user/Avatar.vue";
import MiniProfile from "../user/MiniProfile.vue";

const state = useState();

defineProps<{
  message: IMessage;
}>();
</script>

<style scoped>
.content {
  word-break: break-word;
}
.username:hover p {
  @apply underline;
}
</style>
