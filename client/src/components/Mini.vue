<template>
     <div class="user">
        <router-link :to="`/profile/${user.username}`"><img class="pfp" :src="`https://taku.moe:2087/pfp/${user.uuid}`" alt=""></router-link>
        <div class="info">
        <div>
            <h1>{{user.username}}</h1>
            <div class="channelStatus">
                <div class="icon"></div>
                <p v-if="user.profile.status.lastSeen" class="status">{{translation('last seen at')}} {{new Date(user.profile.status.lastSeen).toLocaleString()}}</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import translation from '@/services/translator.js';

export default {
  name: 'MiniUser',
  props: {
    user: { type: Object, required: true },
  },
  methods: {
    translation
  }
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
