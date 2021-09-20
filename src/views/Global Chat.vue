<template>
  <div class="h-full max-h-97vh w-full flex flex-col justify-end">
    <div class="div pt-2 pb-6 flex gap-1 flex-col-reverse h-full overflow-y-scroll overflow-x-hidden bg-dark-200">
      <Message class="px-2" v-for="message in messages" :key="message._id" :message="message" />
    </div>

    <form
      @submit.prevent="
        api.sendGlobalMessage(input);
        input = '';
      "
      class="bg-dark-400 p-2"
    >
      <input placeholder="Type here" maxlength="2000" @keypress="state.playKeystroke()" type="text" class="rounded-4px w-full bg-dark-300 outline-none border-none" v-model="input" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import api from "../services/api";
import { useState } from "../services/state";
import Message from "../components/chat/Message.vue";
const state = useState();
const messages = computed(() => state.getGlobalMessages());
const input = ref("");
</script>
