<template>
  <audio controls class="max-w-100 rounded-4px">
    <source :src="embed.link" />
  </audio>
</template>

<script setup lang="ts">
import { IAudioEmbed } from "../../services/types";
defineProps<{
  embed: IAudioEmbed;
}>();
</script>
