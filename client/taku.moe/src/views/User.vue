<template>
  <div v-if="user">
    <Banner :url="user.profileBanner || state.defaultBanner"/>
    <div class="flex gap-6 items-start px-10/100 transform -translate-y-20">
      <Avatar :url="user.profileImage  || state.defaultAvatar"/>
      <Buttons :user="user"/>
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
import api, { User } from "../services/api";
import Buttons from "../components/user/Buttons.vue";
const route = useRoute();
const isLoading = ref(true);
const user = ref<User>();
onMounted(async () => {
  user.value = await api.getUser(route.params.uuid as string)
  isLoading.value = false;
});
</script>