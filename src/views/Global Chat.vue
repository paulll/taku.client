<template>
  <div class="h-full max-h-97vh w-full flex flex-col justify-end">
    <div class="div pt-2 pb-6 flex gap-1 flex-col-reverse h-full overflow-y-scroll overflow-x-hidden bg-dark-200">
      <Message class="px-2" v-for="message in messages" :key="message._id" :message="message" />
    </div>

    <div class="bg-dark-300 p-2">
      <textarea
        ref="textarea"
        placeholder="Type here"
        style="resize: none;"
        maxlength="2000"
        :oninput="handleInput"
        @keypress="handleEnter"
        type="text"
        class="rounded-4px w-full h-10 max-h-64 bg-dark-200 outline-none border-none"
        v-model="input">
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { useState } from "../services/state";
import Message from "../components/chat/Message.vue";
import api from "../services/api";
const state = useState();
const messages = computed(() => state.getGlobalMessages());
const input = ref("");

const textarea = ref<HTMLElement | undefined>(undefined);

const autoResize = () => {
  const element = textarea.value;
  if (!element) return;
  element.style.height = element.scrollHeight + "px";
};

const resetResize = () => {
  const element = textarea.value;
  if (!element) return;
  element.style.height = "2.5rem";
};

const handleInput = () => {
  state.playKeystroke();
  autoResize();
};

const handleEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    api.sendGlobalMessage(input.value);
    input.value = "";
    event.preventDefault();
    resetResize();
  };
};

</script>
