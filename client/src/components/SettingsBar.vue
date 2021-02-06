<template>
  <div class="settingsBar" :class="{small: path}" >
    <router-link :class="{hidden: !path}" to="/settings" class="setting back">
      <img src="../assets/back.png" alt="back">
    </router-link>

    <!-- <router-link to="/settings/account" class="setting">
      <img src="../assets/account.png" alt="account">
      <h1>Account</h1>
    </router-link>

    <router-link to="/settings/notification" class="setting">
      <img src="../assets/notification.png" alt="notification">
      <h1>Notifications</h1>
    </router-link> -->

    <router-link to="/settings/appearance" class="setting">
      <img src="../assets/appearance.png" alt="appearance">
      <h1>Appearance & Sounds</h1>
    </router-link>

    <!-- <router-link to="/settings/nsfw" class="setting">
      <img src="../assets/nsfw.png" alt="nsfw">
      <h1>NSFW Content</h1>
    </router-link>

    <router-link to="/settings/language" class="setting">
      <img src="../assets/language.png" alt="language">
      <h1>Language</h1>
    </router-link>

    <router-link to="/settings/feedback" class="setting">
      <img src="../assets/feedback.png" alt="feedback">
      <h1>Feedback</h1>
    </router-link>

    <router-link to="/settings/privacy" class="setting">
      <img src="../assets/privacy.png" alt="privacy">
      <h1>Privacy</h1>
    </router-link>

    <router-link to="/settings/guidelines" class="setting">
      <img src="../assets/guidelines.png" alt="guidelines">
      <h1>Guidelines</h1>
    </router-link>

    <router-link to="/settings/acknowledgements" class="setting">
      <img src="../assets/acknowledgements.png" alt="acknowledgements">
      <h1>Acknowledgements</h1>
    </router-link>

    <router-link to="/settings/info" class="setting">
      <img src="../assets/info.png" alt="info">
      <h1>Information</h1>
    </router-link> -->

  </div>
</template>

<script>
import SettingsBar from '@/components/SettingsBar.vue'
import axios from 'axios';

export default {
  data: () => {
    return {
      path: {},
    };
  },
  watch: {
    $route(to, from) {
        this.path = to.params.setting;
        console.log(this.path);
    }
  },
  mounted() {
    this.path = this.$route.params.setting;
    console.log(this.path);
  },

}

</script>

<style scoped>
.settingsBar {
  background: white;
  min-height: 100vh;
  width: 100vw;
  transition: 200ms ease;
  overflow: hidden;
  position: fixed;
  z-index: 2;
}

.settingsbar:not(.small) {
  padding-top: 0px;
}

.setting {
  display: flex;
  cursor: pointer;
  text-decoration: none;
}

.setting.router-link-active {
   background: #ff006b; 
}

.setting.router-link-active img {
  filter: invert(1);  
}

.setting:hover:not(.router-link-active) {
  filter: invert(13%) sepia(79%) saturate(5683%) hue-rotate(327deg) brightness(104%) contrast(114%);
}

.setting img {
  width: 32px;
  height: 32px;
  padding: 8px 12px;
}

.setting h1 {
  font-family: Work Sans;
  font-style: normal;
  white-space: nowrap;
  font-weight: 500;
  font-size: 16px;
  line-height: 117.9%;
  /* or 21px */

  text-decoration: none;
  color: black;

  display: flex;
  align-items: center;
  text-transform: capitalize;

  margin-left: 4px;
}

.small {
    width: 56px;
}

.hidden {
    opacity: 0%;
    user-select: none;
}

.back img{
  padding: 12px 12px 16px 12px;
}


</style>
