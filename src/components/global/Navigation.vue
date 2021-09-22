<template>
  <nav class="w-full h-16 md:h-full md:w-16 px-2 bg-dark-100">
    <ol class="flex flex-row md:flex-col h-full justify-center items-center">
      <li class="route">
        <router-link :to="{ name: 'user', params: { uuid: state.getMe()?._id } }">
          <Button icon="account" class="border-dark-100" />
        </router-link>
      </li>
      <li class="route">
        <router-link :to="{ name: 'chat', params: { channel_uuid: '@global' } }">
          <Button icon="globe" class="border-dark-100" />
        </router-link>
      </li>
      <li class="route">
        <Button
          icon="logout"
          @click="
            state.clear();
            router.push({ name: 'login' });
          "
          class="border-dark-100"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useState } from "../../services/state";
import Button from "../misc/Button.vue";
const router = useRouter();
const state = useState();
</script>
