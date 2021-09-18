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
import { onMounted, watch } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import Avatar from "../components/user/Avatar.vue";
import Banner from "../components/user/Banner.vue";
import state from "../services/state";
import { useRoute } from "vue-router";
import api from "../services/api";
import Buttons from "../components/user/Buttons.vue";

const route = useRoute();
const me = state.getMe();
const isLoading = ref(true);
const profile = computed(() => state.getLastProfile());
watch(route, async () => await fetchProfile());
onMounted(async () => await fetchProfile());

async function fetchProfile(){
  isLoading.value = true;

  // Get the user
  const user = await api.getUser(route.params.uuid as string);

  if (!user) return isLoading.value = false;

  // If the profile is me use it as a chance to update my state
  if (route.params.uuid === me?._id) state.setMe(user);

  // If the last profile is different than the one 
  // We're seeing cache it in the state
  if (profile.value?._id !== user._id) state.setLastProfile(user);

  isLoading.value = false;
}

</script>
