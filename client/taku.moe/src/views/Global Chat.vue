<template>
  
</template>

<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import Avatar from "../components/user/Avatar.vue";
import Banner from "../components/user/Banner.vue";
import state from "../services/state";
import { useRoute } from "vue-router";
import api from "../services/api";
import { User } from "../services/types";
import Buttons from "../components/user/Buttons.vue";

const route = useRoute();
const me = state.getMe();
const isLoading = ref(true);
const chat = computed(() => state.getGlobalChat());
watch(route, async () => {});
onMounted(async () => {});
</script>
