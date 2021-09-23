<template>
  <div class="w-80 flex flex-col bg-dark-100 p-2 pr-0 overflow-y-scroll overflow-x-hidden">
    <UserListSection name="Online" :users="onlineUsers.sort(userSort)"/>
    <UserListSection name="Away" :users="awayUsers.sort(userSort)"/>
    <UserListSection name="Do not disturb" :users="dndUsers.sort(userSort)"/>
    <UserListSection name="Offline" :users="offlineUsers.sort(userSort)"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { User } from "../../services/types";
import UserListSection from "./UserListSection.vue";

const props = defineProps<{
  users: User[];
}>();

const onlineUsers = computed(() => props.users.filter(user => user.status === 'online'));
const awayUsers = computed(() => props.users.filter(user => user.status === 'away'));
const dndUsers = computed(() => props.users.filter(user => user.status === 'dnd'));
const offlineUsers = computed(() => props.users.filter(user => user.status === 'offline'));
const userSort = (a: any, b: any) => a.username.toLowerCase() < b.username.toLowerCase() ? -1 : 1;
</script>