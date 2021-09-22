<template>
  <div :class="status" class=" box-border w-4 h-2.5 border-3px rounded-4px"></div>
</template>

<script setup lang="ts">
import { StatusTypes } from "../../services/types";
defineProps<{ status: StatusTypes }>();
</script>

<style>

.offline {
  @apply border-gray-400;
}

.online {
  @apply border-lime-400;
}

.away {
  @apply border-yellow-400;
}

.dnd {
  @apply border-red-400;
}

</style>