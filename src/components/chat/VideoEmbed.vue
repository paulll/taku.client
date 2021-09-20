<template>
  <video class="max-w-100 rounded-4px" controls :src="embed.link" />
</template>

<script setup lang="ts">
import { IVideoEmbed } from "../../services/types";
defineProps<{
  embed: IVideoEmbed;
}>();
</script>
