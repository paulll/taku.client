<template>
  <div>
    <nav>
      <a @click="toggleChannelList()">
        <img src="../assets/navbar/Folder.svg" alt="">
      </a>

      <div class="group">
        <router-link :to="{ name: 'home'}">
          <img src="../assets/navbar/Home.svg" alt="">
        </router-link>
<!-- 
        <router-link :to="{ name: 'wallpaper'}">
          <img src="../assets/navbar/Wallpaper.svg" alt="">
        </router-link>

        <router-link :to="{ name: 'upload'}">
          <img src="../assets/navbar/Upload.svg" alt="">
        </router-link> -->

        <router-link v-if="isLoggedIn" :to="{ name: 'messages'}">
          <img src="../assets/navbar/Message.svg" alt="">
        </router-link>
<!-- 
        <router-link :to="{ name: 'notifications'}">
          <img src="../assets/navbar/Bell.svg" alt="">
        </router-link>

        <router-link :to="{ name: 'trash'}">
          <img src="../assets/navbar/Trash.svg" alt="">
        </router-link> -->
      </div>

      <div class="group">
        <router-link v-if="!isLoggedIn" :to="{ name: 'signup'}">
          <img src="../assets/add-user.png" alt="">
        </router-link>
        <router-link v-if="!isLoggedIn" :to="{ name: 'login'}">
          <img src="../assets/login.png" alt="">
        </router-link>
        <a v-if="isLoggedIn" @click='logOut()'>
          <img src="../assets/logout.png" alt="">
        </a>
        <router-link :to="{ name: 'settings'}">
          <img src="../assets/settings.svg" alt="">
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'NavBar',
  computed: {
    isLoggedIn: function(){
      return localStorage.token == undefined || localStorage.token == '' ? false : true;
    },
  },
  methods: {
    logOut(){
      localStorage.clear();
      window.location.href = "https://taku.moe/login";
    },
    toggleChannelList(){
      let settings = JSON.parse(localStorage.settings);
      settings.messages.isChannellistVisible = !settings.messages.isChannellistVisible;
      localStorage.settings = JSON.stringify(settings);
      this.emitter.emit('updateUI');
    }
  },
};
</script>

<style scoped>

nav {
  background: var(--darker);
  height: 100vh;
  width: 56px;
  z-index: 1000;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0px;
  user-select: none;
}



.group {
  display: grid;
  grid-gap: 16px;
}

a {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 100ms ease-in-out;
  outline: none;
}

a.router-link-active, a:hover {
  background: #2C1820;
}


a img {
  width: 32px;
  height: 32px;
  cursor: pointer;

  filter: invert(15%) sepia(4%) saturate(1972%) hue-rotate(182deg) brightness(99%) contrast(81%);
}

a.router-link-active img {
  filter: invert(26%) sepia(92%) saturate(7218%) hue-rotate(327deg) brightness(99%) contrast(109%);
}





</style>
