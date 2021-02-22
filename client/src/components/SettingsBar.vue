<template>
  <div @update-theme="updateUI" class="settingsBar back" :class="{small: path, darkmode: darkmode == 'true'}" >
    
    <div>
      <router-link :class="{hidden: !path, darkmode: darkmode == 'true'}" @mouseover="playHover()" to="/settings" class="setting">
        <img src="../assets/back.png" alt="back">
      </router-link>

      <router-link to="/settings/account" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/account.png" alt="account">
        <h1>Account</h1>
      </router-link> 

      <!-- <router-link to="/settings/notification" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/notification.png" alt="notification">
        <h1>Notifications</h1>
      </router-link> -->

      <router-link to="/settings/appearance" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/appearance.png" alt="appearance">
        <h1>Appearance</h1>
      </router-link>

      <router-link to="/settings/sounds" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/sounds.png" alt="Sounds">
        <h1>Sounds</h1>
      </router-link>

      <!-- <router-link to="/settings/nsfw" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/nsfw.png" alt="nsfw">
        <h1>NSFW Content</h1>
      </router-link>

      <router-link to="/settings/language" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/language.png" alt="language">
        <h1>Language</h1>
      </router-link> -->

      <!-- <router-link to="/settings/feedback" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/feedback.png" alt="feedback">
        <h1>Feedback</h1>
      </router-link> -->

      <router-link to="/settings/privacy" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/privacy.png" alt="privacy">
        <h1>Privacy</h1>
      </router-link>

      <router-link to="/settings/guidelines" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/guidelines.png" alt="guidelines">
        <h1>Guidelines</h1>
      </router-link>

      <router-link to="/settings/acknowledgements" @mouseover="playHover()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
        <img src="../assets/acknowledgements.png" alt="acknowledgements">
        <h1>Acknowledgements</h1>
      </router-link>
    </div>

    <!-- <router-link to="/settings/info" @mouseover="playHover()" @click="playClick()" class="setting" :style="themeColors" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/info.png" alt="info">
      <h1>Information</h1>
    </router-link> -->

    <div @click="logout(), playClick()" @mouseover="playHover()" class="setting logout" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/logout.png" alt="logout">
      <h1>Logout</h1>
    </div>

  </div>
</template>

<script>
import SettingsBar from '@/components/SettingsBar.vue'
import axios from 'axios';

export default {
  props: ['themeColor'],
  data: () => {
    return {
      path: {},
      darkmode: localStorage.darkmode,
    };
  },
  watch: {
    $route(to, from) {
      this.path = to.params.setting; // watch for changes on URL
    }
  },
  mounted() {
    this.path = this.$route.params.setting; // get current path from url

    // Update the theme from the event emitter
    this.emitter.on('updateUI', () => this.updateUI());
  },
  created(){
    this.themeColors = {
        '--themeColor': this.themeColor,
        '--themeColorHover': `${this.themeColor}66`,
    }
  },
  methods: {
    logout(){
      localStorage.removeItem('token');
      window.location.href = "http://taku.moe:8080";
    },
    updateUI(){
      this.darkmode = localStorage.darkmode;
      console.log("updating settings component");
    },
    playHover(){
      if (localStorage.hover_sfx == 'false') return
      if (!this.hoverSoundUrl) this.hoverSoundUrl = require("../../public/hover.wav");
      this.hoverSound = new Audio(this.hoverSoundUrl);
      this.hoverSound.play();
    },
    playClick(){
      if (localStorage.click_sfx == 'false') return
      if (!this.clickSoundUrl) this.clickSoundUrl = require("../../public/click.wav");
      this.clickSound = new Audio(this.clickSoundUrl);
      this.clickSound.play();
    }
  }
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

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.settingsBar.darkmode { background: #020204; } /* darkmode */
.settingsbar:not(.small) { padding-top: 0px; }
.setting {
  display: flex;
  cursor: pointer;
  text-decoration: none;
}

.setting.logout{
  margin-bottom: 56px;
  filter: invert(13%) sepia(79%) saturate(5683%) hue-rotate(327deg) brightness(104%) contrast(114%);
}

.setting.darkmode { filter: invert(1); } /* darkmode */ 
.setting.router-link-active { background: var(--themeColor); }
.setting.setting.router-link-active.darkmode { background: var(--themeColor); } /* darkmode */ 
.setting.router-link-active img { filter: invert(1);   }
.setting:hover:not(.router-link-active) { filter: invert(13%) sepia(79%) saturate(5683%) hue-rotate(327deg) brightness(104%) contrast(114%); }

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

.small { width: 56px; }
.back img { padding: 12px; }
.hidden {
    opacity: 0%;
    user-select: none;
}

</style>
