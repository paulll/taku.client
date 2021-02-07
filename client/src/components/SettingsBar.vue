<template>
  <div @update-theme="updateTheme" class="settingsBar back" :class="{small: path, darkmode: darkmode == 'true'}" >
    <router-link :class="{hidden: !path, darkmode: darkmode == 'true'}" to="/settings" class="setting">
      <img src="../assets/back.png" alt="back">
    </router-link>

    <!-- <router-link to="/settings/account" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/account.png" alt="account">
      <h1>Account</h1>
    </router-link>

    <router-link to="/settings/notification" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/notification.png" alt="notification">
      <h1>Notifications</h1>
    </router-link> -->

    <router-link to="/settings/appearance" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/appearance.png" alt="appearance">
      <h1>Appearance & Sounds</h1>
    </router-link>

    <!-- <router-link to="/settings/nsfw" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/nsfw.png" alt="nsfw">
      <h1>NSFW Content</h1>
    </router-link>

    <router-link to="/settings/language" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/language.png" alt="language">
      <h1>Language</h1>
    </router-link>

    <router-link to="/settings/feedback" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/feedback.png" alt="feedback">
      <h1>Feedback</h1>
    </router-link>

    <router-link to="/settings/privacy" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/privacy.png" alt="privacy">
      <h1>Privacy</h1>
    </router-link>

    <router-link to="/settings/guidelines" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/guidelines.png" alt="guidelines">
      <h1>Guidelines</h1>
    </router-link>

    <router-link to="/settings/acknowledgements" class="setting" :class="{darkmode: darkmode == 'true'}" >
      <img src="../assets/acknowledgements.png" alt="acknowledgements">
      <h1>Acknowledgements</h1>
    </router-link>

    <router-link to="/settings/info" class="setting" :class="{darkmode: darkmode == 'true'}" >
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
    this.emitter.on('updateTheme', () => this.updateTheme());
  },
  methods: {
    updateTheme(){
      this.darkmode = localStorage.darkmode;
      console.log("updating settings component");
    },
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
}

.settingsBar.darkmode { background: #020204; } /* darkmode */
.settingsbar:not(.small) { padding-top: 0px; }
.setting {
  display: flex;
  cursor: pointer;
  text-decoration: none;
}

.setting.darkmode { filter: invert(1); } /* darkmode */ 
.setting.router-link-active { background: #ff006b;  }
.setting.setting.router-link-active.darkmode { background: #00ff94; } /* darkmode */ 
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
