<template>
  <form v-on:submit.prevent="isFormValid && signup()">
    <div class="text">
      <h1>Signup Form</h1>
    </div>

    <div class="fields">
      <input
        v-model="form.username"
        class="inputField text-black"
        type="text"
        placeholder="Username"
        autocomplete="off"
      />
      <input
        v-model="form.email"
        class="inputField text-black"
        type="text"
        placeholder="Email"
        autocomplete="off"
      />
      <input v-model="form.password" class="inputField text-black" type="password" placeholder="Password" />
      <input
        v-model="form.repeatPassword"
        class="inputField text-black"
        type="password"
        placeholder="Repeat Password"
      />
    </div>

    <button type="submit" :class="{ disabled: isFormValid || isLoading }">
      Signup
      <h1 v-if="isLoading">Loading...</h1>
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import router from "../router";
import api from "../services/api";
import state from "../services/state";

const isLoading = ref(false);
const isFormValid = computed(() => Object.values(form).some((field) => field == ""));

const form = ref({
  username: "",
  password: "",
  repeatPassword: "",
  email: "",
});

const signup = async () => {
  isLoading.value = true;
  const response = await api.signup(form.value);
  if (response.token && response.user) {
    state.setToken(response.token);
    state.setMe(response.user);
  }
  isLoading.value = false;
  response.code === "signup.sucessfull" && router.push({ name: "user", params: { uuid: response.user?._id } });
};
</script>
