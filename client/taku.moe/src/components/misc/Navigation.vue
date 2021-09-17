<template>
  <nav class="h-full w-16">
    <ol class="flex flex-col h-full justify-center items-center">
      <li class="route">
        <router-link :to="{ name: 'user' }"> 
          <Avatar class="w-16 h-16" :url="state.getMe()?.profileImage || state.defaultAvatar" /> 
        </router-link>
      </li>
      <!-- <li class="route"><router-link :to="{name: 'chat'}"></router-link></li> -->
      <!-- <li class="route"><router-link :to="{name: 'settings'}"></router-link></li> -->
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import state from "../../services/state";
import { User } from "../../services/types";
import Avatar from "../user/Avatar.vue";
</script>

<style lang="postcss" scoped></style>
