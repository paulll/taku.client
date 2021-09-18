<template>
  <div class="h-full w-full flex flex-col justify-end">
    <div class="div flex gap-2 flex-col-reverse h-full overflow-y-scroll bg-dark-300">
      <div class="flex gap-2 items-center" v-for="message in messages" :key="message._id">
        <Avatar class="w-6 h-6" :url="refState().getUser(message.author_id)?.profileImage" />
        <router-link :to="{name: 'user', params: { uuid: refState().getUser(message.author_id)?._id}}">
          <p class="text-orange-500 font-semibold">{{refState().getUser(message.author_id)?.username}}</p>
        </router-link>
        <h1>{{message.content}}</h1>
        <p class="text-sm text-dark-500">{{new Date(message.created_at).toLocaleTimeString()}}</p>
      </div>
    </div>

    <form @submit.prevent="api.sendGlobalMessage(input); input = ''" class="bg-dark-400 p-2">
      <input placeholder="Type here" type="text" class=" rounded-4px w-full bg-dark-300 outline-none border-none" v-model="input">
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import api from "../services/api";
import state from "../services/state";
import Avatar from "../components/user/Avatar.vue";
const refState = () => state;
const messages = computed(() => state.getGlobalMessages());
const input = ref("");
</script>