<template>
  <div class="h-full w-full flex flex-col justify-end">
    <div class="div flex gap-2 flex-col-reverse h-full overflow-y-scroll bg-dark-300">
      <Message v-for="message in messages" :key="message._id" :message="message" />
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
import Message from "../components/chat/Message.vue";
const messages = computed(() => state.getGlobalMessages());
const input = ref("");
</script>