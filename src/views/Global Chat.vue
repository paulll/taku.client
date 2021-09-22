<template>
  <div class="h-full gap-2 w-full flex flex-col justify-end">
    <div class="div py-2 flex gap-1 flex-col-reverse h-full overflow-y-scroll overflow-x-hidden bg-dark-200">
      <Message class="px-2" v-for="message in messages" :key="message.author_id" :message="message" />
    </div>

    <div class="bg-transparent h-min p-2">
      <textarea
        ref="textarea"
        placeholder="Type here"
        style="resize: none"
        maxlength="2000"
        :oninput="handleInput"
        @keydown="handleEnter"
        type="text"
        class="rounded-4px w-full h-10 max-h-64 bg-dark-300 outline-none border-none"
        v-model="input"
      >
      </textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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

watch(input, async (to) => to === "" && resetResize());

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
  if (event.key === "Enter" && !event.shiftKey) {
    // If the input is full of \n and no text don't allow enter to create
    // a \n and don't send the message
    if (input.value.trim() == "") return event.preventDefault();
    api.sendGlobalMessage(input.value.trim());
    input.value = "";
    event.preventDefault();
    resetResize();
  }
};
</script>
