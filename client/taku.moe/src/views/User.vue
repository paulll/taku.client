<template>
  <div class="h-full w-full" v-if="user">
    <Banner class="h-96" :url="user.profileBanner || state.defaultBanner" />
    <div class="flex gap-6 h-40 items-start px-10/100 transform -translate-y-20">
      <Avatar class="w-40 h-40 border-4 border-dark-100" :url="user.profileImage || state.defaultAvatar" />
      <Buttons :user="user" />
    </div>
  </div>
  <div v-else-if="!isLoading">
    <h1>Found fuck all</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import Avatar from "../components/user/Avatar.vue";
import Banner from "../components/user/Banner.vue";
import state from "../services/state";
import { useRoute } from "vue-router";
import api from "../services/api";
import { User } from "../services/types";
import Buttons from "../components/user/Buttons.vue";

const route = useRoute();
let isLoading = ref(true);
let user = ref<User>();
onMounted(async () => {
  user.value = await api.getUser(route.params.uuid as string);
  isLoading.value = false;
});
</script>
