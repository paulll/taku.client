<template>
  <a :href="embed.link" target="_blank" title="Open original">
    <img class="max-w-100 max-h-96 rounded-4px" :src="embed.link" />
  </a>
</template>

<script setup lang="ts">
import { IImageEmbed } from "../../services/types";
defineProps<{
  embed: IImageEmbed;
}>();
</script>
