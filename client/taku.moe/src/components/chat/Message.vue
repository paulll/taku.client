<template>
  <div class="flex gap-2 items-center">
    <Avatar class="w-6 h-6" :url="state.getUser(message.author_id)?.profileImage" />
    <router-link class="username" :to="{ name: 'user', params: { uuid: state.getUser(message.author_id)?._id } }">
      <p class="text-orange-500 font-semibold">{{ state.getUser(message.author_id)?.username }}</p>
    </router-link>
    <h1>{{ message.content }}</h1>
    <p class="text-sm text-dark-500">{{ new Date(message.created_at).toLocaleTimeString() }}</p>
  </div>
</template>

<script setup lang="ts">
import state from "../../services/state";
import Avatar from "../../components/user/Avatar.vue";
import { IMessage } from "../../services/types";
defineProps<{
  message: IMessage;
}>();
</script>

<style>

.username:hover p {
  @apply underline;
}

</style>