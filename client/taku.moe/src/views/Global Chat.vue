<template>
  <form @submit.prevent="api.sendGlobalMessage(input); input = ''">
    <input type="text" class="text-black" v-model="input">
  </form>

  <div class="div flex flex-col">
    <h1 v-for="message in messages" :key="message">{{message}}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import api from "../services/api";
import state from "../services/state";
const messages = computed(() => state.getGlobalMessages());
const input = ref("");
</script>
