<template>
  <div class="h-full w-full" v-if="profile">
    <Banner class="h-96" :url="profile.profileBanner || state.defaultBanner" />
    <div class="flex gap-6 h-40 items-start px-10/100 transform -translate-y-20">
      <Avatar class="w-40 h-40 border-4 border-dark-100" :url="profile.profileImage || state.defaultAvatar" />
      <Buttons :user="profile" />
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
const me = state.getMe();
const isLoading = ref(true);
let profile: Ref<User> = ref({});

onMounted(async () => {
  const user = await api.getUser(route.params.uuid as string);
  if (route.params.uuid === me?._id) {
    profile.value = me;
    state.setMe(user);
    isLoading.value = false;
    return
  }
  profile.value = user;
  isLoading.value = false;
});
</script>
