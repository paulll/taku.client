<template>
  <Banner :url="user?.profileBanner || state.defaultBanner"/>
  <Avatar :url="user?.profileImage || state.defaultAvatar"/>
  <div>
    <h1>{{user.username}}</h1>
    <h1>{{user.email}}</h1>
    <h1>{{new Date(user.created_at).toLocaleString()}}</h1>
  </div>
</template>

<script setup lang="ts">
import Banner from "../../components/user/Banner.vue";
import Avatar from "../../components/user/Avatar.vue";
import { User } from "../../services/api";
import state from "../../services/state";
defineProps<{
  user: User
}>();
</script>