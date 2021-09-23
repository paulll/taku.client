<template>
  <router-link class="channel rounded-4px opacity-25 hover:opacity-100 hover:bg-dark-300 py-1 px-2 flex gap-2 items-center" :to="{name: 'chat', params: {channel_uuid: uuid}}">
    <Icon icon="hashtag" class="w-5"/>
    <h1>{{name}}</h1>
  </router-link>
</template>

<script setup lang="ts">
import Icon from "../misc/Icon.vue";
defineProps<{
  name: string;
  uuid: string;
}>();
</script>

<style>

.channel.router-link-active:not(:hover) {
  @apply opacity-100 bg-dark-300;
}

.channel.router-link-active:hover {
  @apply bg-dark-400;
}


</style>
