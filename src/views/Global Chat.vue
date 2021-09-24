<template>

  <div class="w-48 max-w-48 min-w-48 bg-dark-100 flex flex-col p-2">
    <ChannelButton name="@global" uuid="@global" />
  </div>

  <div class="h-full gap-2 w-full flex flex-col justify-end">
    <div :onscroll="handleScroll" ref="chat" class="div py-2 flex gap-1 flex-col-reverse h-full overflow-y-scroll overflow-x-hidden bg-dark-200">
      <Message class="px-2" v-for="(message, index) in messages" :key="message.author_id" :message="message" :minimal="messages[index + 1]?.author_id === message.author_id" />
    </div>

    <div class="bg-transparent flex gap-2 h-min p-2">
      <input type="file" style="display: none" @change="handleFileInput" name="file" ref="fileInput" multiple />
      <SimpleButton icon="plus" class="bg-dark-300 w-10 h-10 min-w-10 min-h-10" @click="fileInput?.click()" />

      <div class="inputs flex-col flex w-full bg-dark-400 overflow-hidden rounded-8px">
        <div v-if="previews.length !== 0" class="bg-dark-400 flex gap-2 flex-wrap p-2 pb-2 rounded-16px" >
          <img v-for="preview, index of previews" :src="preview" @click="removeFile(index)" class="cursor-pointer w-24 rounded-4px">
        </div>
        <textarea
          ref="textarea"
          placeholder="Send a message"
          style="resize: none"
          maxlength="2000"
          :oninput="handleInput"
          @keydown="handleEnter"
          type="text"
          class="rounded-8px z-10 px-4 w-full h-10 max-h-64 bg-dark-300 outline-none border-none"
          v-model="input"
        >
        </textarea>
      </div>
      <SimpleButton icon="paperplane" class="bg-pink-400 w-10 h-10 min-w-10 min-h-10" @click="sendMessage()" />
    </div>
  </div>

  <UserList :users="state.getAllUsers()" />
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { computed } from "@vue/reactivity";
import { useState } from "../services/state";
import api from "../services/api";
import Message from "../components/chat/Message.vue";
import UserList from "../components/chat/UserList.vue";
import ChannelButton from "../components/chat/ChannelButton.vue";
import SimpleButton from "../components/misc/SimpleButton.vue";
const state = useState();
const messages = computed(() => state.getGlobalMessages());

const input = ref("");
const isAtTop = ref(false);
const textarea = ref<HTMLElement>();
const chat = ref<HTMLElement>();
const fileInput = ref<HTMLElement>();

const previews: Ref<string[]> = ref([]);
const attachments: Ref<File[]> = ref([]);

watch(input, async (to) => to === "" && resetResize());

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

const handleFileInput = (event: Event) => {
  const { files } = <HTMLInputElement>event.target;
  if (!files) return;
  for (let i = 0; i < files.length; i++) {
   previews.value.push(URL.createObjectURL(files[i]));
   attachments.value.push(files[i]);
  }
}

const removeFile = (index: number) => {
  attachments.value.splice(index, 1)
  previews.value.splice(index, 1)
};

const handleEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    // If the input is full of \n and no text don't allow enter to create
    // a \n and don't send the message
    if (input.value.trim() == "") return event.preventDefault();
    api.sendGlobalMessage(input.value.trim(), attachments.value);
    input.value = "";
    event.preventDefault();
    resetResize();
  }
};

const sendMessage = () => {
  api.sendGlobalMessage(input.value.trim(), attachments.value);
  input.value = "";
  resetResize();
}

</script>
