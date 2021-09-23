<template>
  <audio controls class="max-w-100 h-full max-h-96 rounded-4px">
    <source :src="embed.link" />
  </audio>
</template>

<script setup lang="ts">
import { IAudioEmbed } from "../../services/types";
defineProps<{
  embed: IAudioEmbed;
}>();
</script>
