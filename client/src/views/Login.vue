<template>
  <form v-on:submit.prevent="isFormValid && login()">
    <div class="text">
      <h1>Login Form</h1>
    </div>

    <div class="fields">
      <input
        v-model="form.username"
        class="inputField text-black"
        type="text"
        placeholder="Username"
        autocomplete="off"
      />
      <input v-model="form.password" class="inputField text-black" type="password" placeholder="Password" />
    </div>

    <button type="submit" :class="{ disabled: isFormValid || isLoading }">
      Login
      <h1 v-if="isLoading">Loading...</h1>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import router from "../router";
import api from "../services/api";
import { useState }  from "../services/state";
const state = useState();
const isLoading = ref(false);
const isFormValid = computed(() => Object.values(form).some((field) => field == ""));

const form = ref({
  username: "",
  password: "",
});

const login = async () => {
  isLoading.value = true;
  const response = await api.login(form.value);
  if (response.token && response.user) {
    state.setToken(response.token);
    state.setMe(response.user);
    response.code === "login.successful" && router.push({ name: "user", params: { uuid: response.user?._id } });
  }
  isLoading.value = false;
};
</script>
