<template>
 {{me}}
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import { useRoute } from "vue-router";
import state from "../services/state";
const route = useRoute();
const { uuid } = route.params;
const me = ref();
onMounted(async () => {
  me.value = await state.getMe(uuid as string);
  console.log(me.value);
}) 
</script>