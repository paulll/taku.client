<template>
  <div class="settings">
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'home',
  data: () => {
    return {
      data: {},
    };
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      const user = await axios.get('http://localhost:8880/user', {
          withCredentials: true,
      });

      console.log(user.data);
    },
  }
}

</script>

<style scoped>
</style>