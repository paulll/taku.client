<template>
  <div @update-theme="updateUI" class="settingsBar">
    <router-link to="/settings/account"  class="setting">
      <img src="../assets/account.png" alt="account">
      <h1>{{translation('Account')}}</h1>
    </router-link> 

    <router-link to="/settings/language"  class="setting">
      <img src="../assets/language.png" alt="language">
      <h1>{{translation('Language')}}</h1>
    </router-link> 

    <router-link to="/settings/notification"  class="setting">
      <img src="../assets/notification.png" alt="notification">
      <h1>{{translation('Notifications')}}</h1>
    </router-link>

    <router-link to="/settings/appearance"  class="setting">
      <img src="../assets/appearance.png" alt="appearance">
      <h1>{{translation('Appearance')}}</h1>
    </router-link>

    <router-link to="/settings/sounds"  class="setting">
      <img src="../assets/sounds.png" alt="Sounds">
      <h1>{{translation('Sounds')}}</h1>
    </router-link>

    <router-link to="/settings/connections"  class="setting">
      <img src="../assets/connections.png" alt="connections">
      <h1>{{translation('Connections')}}</h1>
    </router-link> 

    <router-link to="/settings/nsfw"  class="setting">
      <img src="../assets/nsfw.png" alt="nsfw">
      <h1>{{translation('NSFW')}} Content</h1>
    </router-link>

    <router-link to="/settings/feedback"  class="setting">
      <img src="../assets/feedback.png" alt="feedback">
      <h1>{{translation('Feedback')}}</h1>
    </router-link>

    <router-link to="/settings/privacy"  class="setting">
      <img src="../assets/privacy.png" alt="privacy">
      <h1>{{translation('Privacy')}}</h1>
    </router-link>

    <router-link to="/settings/guidelines"  class="setting">
      <img src="../assets/guidelines.png" alt="guidelines">
      <h1>{{translation('Guidelines')}}</h1>
    </router-link>

    <router-link to="/settings/acknowledgements"  class="setting">
      <img src="../assets/acknowledgements.png" alt="acknowledgements">
      <h1>{{translation('Acknowledgements')}}</h1>
    </router-link>
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
    // Fetches right translation of the site
    translation(sentence){
        if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
        else this.languageTable = require(`@/languages/${localStorage.language}.json`);
        let translatedSentence = this.languageTable[sentence];
        if (!translatedSentence) return sentence;
        return translatedSentence;
    },
    logout(){
      localStorage.removeItem('token');
      window.location.href = "https://taku.moe";
    },
    updateUI(){
      this.darkmode = localStorage.darkmode;
      console.log("updating settings component");
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
  background: var(--dark);
  min-height: 100vh;
  width: 320px;
  transition: 200ms ease;
  overflow: hidden;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  min-width: 320px;
  color: var(--textDark);
  padding: 8px;
}

.setting {
  width: 100%;
  display: flex;
  padding: 8px 16px 8px 8px;
  color: var(--textLight);
  border-radius: 4px;
  border: transparent 1px solid;
  height: 48px;
  gap: 4px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  align-items: center;
}

.setting.router-link-active {
  background: var(--light);
}

.setting:hover { 
  border: var(--hoverOutline) 1px solid;
}

.setting img {
  width: 32px;
  height: 32px;
  filter: invert(42%) sepia(7%) saturate(216%) hue-rotate(191deg) brightness(99%) contrast(86%);
}

.setting h1 {
  font-family: Work Sans, system-ui;;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: left;
  white-space: nowrap;

  text-decoration: none;
  color: var(--textDark);

  display: flex;
  align-items: center;
  text-transform: capitalize;

  margin-left: 4px;
}

.small { width: 56px; }
.back img { 
  margin: 12px; 
  z-index: 1000;
}

.hidden {
    opacity: 0%;
    user-select: none;
}

</style>
