<template>
  <Avatar class="h-8 max-h-8" :url="user.avatar" />
  <Status :status="user.status" :device="user.device" />
  {{user.username}}
</template>

<script setup lang="ts">
import { User } from "../../services/types";
import Status from "../user/Status.vue";
import Avatar from "../user/Avatar.vue";
defineProps<{  user: User }>();
</script>