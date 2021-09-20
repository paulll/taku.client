<template>
  <div class="miniProfileBox flex relative cursor-pointer">
    <slot/>
    <div class="miniProfile flex flex-col overflow-hidden bg-dark-100 bottom-12 drop-shadow-2xl hidden z-10 absolute rounded-4px h-48 w-96">
      <Banner class="h-1/2" :url="user?.profileBanner" />
      <div class="p-4 transform gap-2 -translate-y-12 flex">
        <Avatar class="w-20 h-20" :url="user?.profileImage"/>
        <div class="flex flex-col gap-4 justify-between">
          <h1 class="text-xl">{{user?.username}}</h1>
          <router-link :to="{name: 'user', params: {uuid: user?._id}}">
            <Button icon="arrow-right" class="border-dark-100" text="Profile" />
          </router-link>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useState } from "../../services/state";
import { User } from "../../services/types";
import Banner from "./Banner.vue";
import Avatar from "./Avatar.vue";
import Button from "../misc/Button.vue";
const state = useState();
defineProps<{
  user?: User;
}>();
</script>

<style scoped>

.miniProfileBox:hover .miniProfile {
  @apply flex;
}
</style>