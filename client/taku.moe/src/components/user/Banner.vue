<template>
  <div 
    :style="`background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), url(${url});`" 
    alt="Profile Banner" 
    class="h-96 w-full bg-no-repeat bg-cover bg-center" 
  />
</template>

<script setup lang="ts">
defineProps<{
  url: string
}>();
</script>