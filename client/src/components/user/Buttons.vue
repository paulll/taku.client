<template>
  <div class="flex flex-col font-medium h-full py-2 gap-12">
    <div class="top">
      <h1 class="text-5xl">{{ user.username }}</h1>
    </div>
    <div class="bottom flex gap-4 text-lg items-center">
      <Button :icon="isEditing ? 'save' : 'edit'" :text="isEditing ? 'Save' : 'Edit'" @click="state.setIsEditingProfile(!state.getIsEditingProfile()); !isEditing && $emit('save')" />
      <Button v-if="isEditing" icon="cancel" text="Cancel" @click="$emit('cancel')" />
      <h1>{{ user.email }}</h1>
      <h1>{{ new Date(user.created_at).toLocaleString() }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useState } from "../../services/state";
import { User } from "../../services/types";
import Button from "../misc/Button.vue";

const state = useState();
const isEditing = computed(() => state.getIsEditingProfile());

defineProps<{
  user: User;
}>();

defineEmits(['cancel', 'save']);

</script>
