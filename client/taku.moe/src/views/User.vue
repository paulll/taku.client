<template>
  <ProfileHeader v-if="user" :user="user"/>
  <div v-else-if="!isLoading">
    <h1>Found fuck all</h1>
  </div>
</template>

<script setup lang="ts">
import Banner from "../components/user/Banner.vue";
import Avatar from "../components/user/Avatar.vue";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import { useRoute } from "vue-router";
import state from "../services/state";
import api, { User } from "../services/api";
import ProfileHeader from "../components/user/ProfileHeader.vue";
const route = useRoute();
const isLoading = ref(true);
const user = ref<User>();
onMounted(async () => {
  user.value = await api.getUser(route.params.uuid as string)
  isLoading.value = false;
});
</script>