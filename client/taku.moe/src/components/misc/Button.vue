<template>
  <button class="bg-pink-300 transition duration-100 ease py-2px rounded-4px px-8px">
    <div class="p-4px bg-pink-300">
      <p>{{ text }}</p>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
