<template>
  <div class="h-full w-full" v-if="profile">
    <Banner @click="isEditing && banner?.click()" class="h-96" :class="isEditing && 'editing'" :url="newBannerPreview || profile.profileBanner || state.defaultBanner" />
    <div class="flex gap-6 h-40 items-start px-10/100 transform -translate-y-20">
      <form v-if="isEditing" style="display: none">
        <input type="file" @change="onAvatarChange" id="avatar" name="avatar" ref="avatar" accept="image/*" />
        <input type="file" @change="onBannerChange" id="banner" name="banner" ref="banner" accept="image/*" />
      </form>

      <Avatar @click="isEditing && avatar?.click()" class="w-40 h-40 border-8px bg-dark-200 border-dark-200" :class="isEditing && 'editing'" :url="newAvatarPreview || profile.profileImage || state.defaultAvatar" />
      <Buttons :user="profile" @save="updateProfile()" @cancel="cancelEdit()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import { useState } from "../services/state";
import { useRoute } from "vue-router";
import api from "../services/api";

import Avatar from "../components/user/Avatar.vue";
import Banner from "../components/user/Banner.vue";
import Buttons from "../components/user/Buttons.vue";

const state = useState();
const route = useRoute();

const me = state.getMe();
const profile = computed(() => state.getLastProfile());

const avatar = ref<HTMLDivElement | undefined>(undefined);
const banner = ref<HTMLDivElement | undefined>(undefined);

const isEditing = computed(() => state.getIsEditingProfile());
const newAvatarPreview = ref<string>();
const newBannerPreview = ref<string>();

let newAvatar: File | undefined;
let newBanner: File | undefined;

watch(route, async () => await fetchProfile());
onMounted(async () => await fetchProfile());

const onAvatarChange = (event: any) => {
  newAvatar = event.target.files[0];
  newAvatarPreview.value = URL.createObjectURL(newAvatar);
};
const onBannerChange = (event: any) => {
  newBanner = event.target.files[0];
  newBannerPreview.value = URL.createObjectURL(newBanner);
};

const cancelEdit = async () => {
  newBanner = undefined;
  newAvatar = undefined;
  newBannerPreview.value = undefined;
  newAvatarPreview.value = undefined;
  state.setIsEditingProfile(false);
};

const updateProfile = async () => {
  await api.updateProfile({
    banner: newBanner,
    avatar: newAvatar,
  });
  await fetchProfile();
};

const fetchProfile = async () => {
  // Get the user
  const user = await api.getUser(route.params.uuid as string);

  if (!user) return;

  // If the profile is me use it as a chance to update my state
  route.params.uuid === me?._id && state.setMe(user);

  // If the last profile is different than the one
  // We're seeing cache it in the state
  profile.value?._id !== user._id && state.setLastProfile(user);
};
</script>

<style scoped>
.editing {
  cursor: pointer;
}
</style>
