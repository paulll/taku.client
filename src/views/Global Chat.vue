<template>
  <div class="h-full gap-2 w-full flex flex-col justify-end">
    <div :onscroll="handleScroll" ref="chat" class="div py-2 flex gap-1 flex-col-reverse h-full overflow-y-scroll overflow-x-hidden bg-dark-200">
      <Message class="px-2" v-for="(message, index) in messages" :key="message.author_id" :message="message" :minimal="messages[index + 1]?.author_id === message.author_id" />
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
  <div class="w-64 flex flex-col bg-dark-100 p-2">
    <UserList name="Online" :users="state.getAllUsers().filter(user => user.status === 'online')"/>
    <UserList name="Away" :users="state.getAllUsers().filter(user => user.status === 'away')"/>
    <UserList name="Do not disturb" :users="state.getAllUsers().filter(user => user.status === 'dnd')"/>
    <UserList name="Offline" :users="state.getAllUsers().filter(user => user.status === 'offline')"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { computed } from "@vue/reactivity";
import { useState } from "../services/state";
import api from "../services/api";
import Message from "../components/chat/Message.vue";
import UserList from "../components/chat/UserList.vue";

const state = useState();
const messages = computed(() => state.getGlobalMessages());
const input = ref("");
const isAtTop = ref(false);

const textarea = ref<HTMLElement>();
const chat = ref<HTMLElement>();

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

const handleScroll = async (event: Event) => {
  const scrollTop = chat.value?.scrollTop;
  const scrollHeight = chat.value?.scrollHeight;
  if (!scrollTop || !scrollHeight) return;
  if (!isAtTop.value) {
    if (Math.abs(scrollTop - window.innerHeight) > scrollHeight) {
      isAtTop.value = true;
      const newMessages = await api.getMessages("@global", messages.value.length, 50);
      state.unshiftGlobalMessages(newMessages);
      isAtTop.value = false;
    }
  }
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
