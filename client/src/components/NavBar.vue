<template>
  <div>

    <nav>
      <a @click="$router.go(-1)">
        <img src="../assets/back.png" alt="back">
      </a>

      <div class="group">
        <router-link to='/home'>
          <img src="../assets/home.svg" alt="">
        </router-link>

        <router-link to='/messages'>
          <img src="../assets/chat.png" alt="">
        </router-link>

        <!-- <router-link to='/notifications'>
          <img src="../assets/notification.png" alt="">
        </router-link> -->
      </div>

      <router-link to='/settings'>
        <img src="../assets/settings.svg" alt="">
      </router-link>

    </nav>
  </div>
</template>

<script>

export default {
  name: 'NavBar',
};
</script>

<style scoped>

nav {
  background: white;
  height: 100vh;
  width: 80px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  border-right: #F1F2F4 2px solid;
}

.group {
  display: grid;
  grid-gap: 16px;
}

a {
  width: 48px;
  height: 48px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 100ms ease-in-out;

  outline: none;
}

a:hover {
  transform: scale(1.04);
}

a.router-link-active, a:hover {
  background: #FFF0F6;
}


a img {
  width: 32px;
  height: 32px;
  cursor: pointer;

  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
}

a.router-link-active img {
  filter: invert(26%) sepia(92%) saturate(7218%) hue-rotate(327deg) brightness(99%) contrast(109%);
}





</style>
