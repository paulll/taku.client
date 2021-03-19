<template>
  <div>

    <nav>
      <a @click="$router.go(-1)">
        <img src="../assets/navbar/Folder.svg" alt="">
      </a>

      <div class="group">
        <router-link to='/home'>
          <img src="../assets/navbar/Home.svg" alt="">
        </router-link>

        <router-link to='/wallpaper'>
          <img src="../assets/navbar/Wallpaper.svg" alt="">
        </router-link>

        <router-link to='/upload'>
          <img src="../assets/navbar/Upload.svg" alt="">
        </router-link>

        <router-link to='/messages'>
          <img src="../assets/navbar/Message.svg" alt="">
        </router-link>

        <router-link to='/notifications'>
          <img src="../assets/navbar/Bell.svg" alt="">
        </router-link>

        <router-link to='/trash'>
          <img src="../assets/navbar/Trash.svg" alt="">
        </router-link>
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
  position: relative;

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
