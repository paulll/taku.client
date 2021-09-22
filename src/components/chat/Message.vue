<template>
  <div class="flex gap-2 max-w-full items-start hover:bg-dark-300">
    <Avatar v-if="!minimal" class="w-10 h-10 min-w-10 min-h-10 mt-1" :url="state.getUser(message.author_id)?.avatar" />
    <div class="flex flex-col" :class="minimal && 'pl-12'">
      <div v-if="!minimal" class="flex gap-2 items-center">
        <router-link class="username" :to="{ name: 'user', params: { uuid: state.getUser(message.author_id)?._id } }">
          <p class="text-orange-500 font-semibold">{{ state.getUser(message.author_id)?.username }}</p>
        </router-link>
        <p class="text-sm text-dark-500">{{ new Date(message.created_at).toLocaleTimeString() }}</p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="content whitespace-pre-line" v-html="content"></div>
        <div v-for="embed in embeds" :key="embed.link" class="w-min">
          <AudioEmbed v-if="embed.type === 'audio'" :embed="embed" />
          <ImageEmbed v-if="embed.type === 'image'" :embed="embed" />
          <VideoEmbed v-if="embed.type === 'video'" :embed="embed" />
          <MiniProfile v-if="embed.type === 'profile'" :uuid="embed.uuid" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import { IMessage } from "../../services/types";
import { getEmbeds, renderLinks } from "../../services/logic";
import Avatar from "../../components/user/Avatar.vue";
import MiniProfile from "../user/MiniProfile.vue";
import { computed } from "@vue/reactivity";
import DOMPurify from "dompurify";

import AudioEmbed from "./AudioEmbed.vue";
import ImageEmbed from "./ImageEmbed.vue";
import VideoEmbed from "./VideoEmbed.vue";

const state = useState();
const props = defineProps<{
  message: IMessage;
  minimal: boolean;
}>();

const embeds = computed(() => getEmbeds(props.message.content));
const content = computed(() =>  DOMPurify.sanitize(renderLinks(props.message.content) || '', {ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href', 'target', 'class']}));

</script>

<style lang="postcss">
.username:hover p {
  @apply underline;
}
.content {
  word-break: break-word;
}

.content .link {
  @apply text-blue-600;

  &:hover {
    @apply underline;
  }
}

</style>
