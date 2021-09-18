<template>
  <nav class="h-full w-16 px-2 bg-dark-100">
    <ol class="flex flex-col h-full justify-center items-center">
      <li class="route">
        <router-link :to="{ name: 'user', params: {uuid: state.getMe()?._id}}"> 
          <Button icon="account" class="border-dark-100" />
        </router-link>
      </li>
      <li class="route">
        <router-link :to="{ name: 'chat', params: {channel_uuid: '@global'}}"> 
          <Button icon="globe" class="border-dark-100" />
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import state from "../../services/state";
import { User } from "../../services/types";
import Avatar from "../user/Avatar.vue";
import Icon from "./Icon.vue";
import Button from "./Button.vue";
</script>

<style lang="postcss" scoped></style>
