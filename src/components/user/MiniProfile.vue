<template>
  <div v-if="user" class="miniProfile flex flex-col overflow-hidden bg-dark-100 bottom-12 drop-shadow-2xl rounded-4px h-48 w-96">
    <Banner class="h-1/2" :url="user.banner" />
    <div class="p-4 transform gap-2 -translate-y-12 flex">
      <Avatar class="w-20 h-20 min-w-20 min-h-20" :url="user.avatar" />
      <div class="flex flex-col gap-4 justify-between">
        <div class="flex gap-2">
          <Status class="w-6" :status="user.status" :device="user.device" />
          <h1 class="text-xl">{{ user.username }}</h1>
        </div>
        <router-link :to="{ name: 'user', params: { uuid: user._id } }">
          <Button icon="arrow-right" class="border-dark-100" text="Profile" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Banner from "./Banner.vue";
import Avatar from "./Avatar.vue";
import Button from "../misc/Button.vue";
import api from "../../services/api";
import { onMounted } from "@vue/runtime-core";
import { ref } from "vue";
import Status from "./Status.vue";

const user = ref();
const props = defineProps<{ uuid: string }>();
onMounted(async () => (user.value = await api.getUser(props.uuid)));
</script>
