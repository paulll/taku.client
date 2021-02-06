<template>
  <div class="settings">
    <SettingsBar/>

    <div class="settingsArea">
      <div v-if="path == 'appearance'" class="appearanceAndSounds">
        <div class="option">
          <div>
            <img src="../assets/darkmode.png" alt="darkmode">
            <h1>Darkmode</h1>
          </div>
          <div class="onOff">
            <button @click="toggleOption(true, 'darkmode')" :class="{active: user.settings.appearance.darkmode == true}">on</button>
            <button @click="toggleOption(false, 'darkmode')" :class="{active: user.settings.appearance.darkmode == false}">off</button>
          </div>
        </div>
        <div class="splitter"></div>
        <div class="optionBox">
          <div class="top">
            <div class="heading">
              <img src="../assets/keyboard.png" alt="darkmode">
              <h1>Typing SFX</h1>
            </div>
            <div class="onOff">
              <button @click="toggleOption(true, 'typingSfx')" :class="{active: user.settings.appearance.typing_sfx.enabled == true}">on</button>
              <button @click="toggleOption(false, 'typingSfx')" :class="{active: user.settings.appearance.typing_sfx.enabled == false}">off</button>
            </div>
          </div>
          <div class="bottom">
            <!-- <p>{{user.settings.appearance.typing_sfx.url.split("/")[user.settings.appearance.typing_sfx.url.split("/").length - 1]}}</p> -->
            <p>keystroke.wav</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SettingsBar from '@/components/SettingsBar.vue'
import MobileHeader from '@/components/MobileHeader.vue'

import axios from 'axios';
import mitt from 'mitt';

const emitter = mitt();

export default {
  name: 'home',
  components: {
    SettingsBar
  },
  data: () => {
    return {
      path: "",
      user: {},
    };
  },
  watch: {
    $route(to, from) {
      this.path = to.params.setting;
      console.log(this.path);
    }
  },
  mounted() {
    this.getUser();
    this.path = this.$route.params.setting;
  },
  methods: {
    async getUser() {
      const user = await axios.get('http://anihuu.moe:8880/user', {
        withCredentials: true,
      });

      this.user = user.data;

      // Add the new settings structure on the user
      // This is here so old users don't have an issue with loading the settings
      // Once they will update their settings this will go on their database
      // In v1.0 this should be removed
      if (!user.data.settings.appearance) {
        this.user.settings.appearance = {
          darkmode: false,
          anime_pfps: true,
          typing_sfx: {
            enabled: true,
            url: ""
          },
          mention_sfx: {
            enabled: true,
            url: ""
          },
          theme_color: "#ff006b"
        }
      }

      console.log(user.data);
    },
    async toggleOption(state, option){

      switch (option) {
        case "darkmode":
          this.user.settings.appearance.darkmode = state;
          localStorage.setItem('darkmode', state);
          this.emitter.emit('updateTheme');
          break;
      
        case "typingSfx":
          this.user.settings.appearance.typing_sfx.enabled = state;
          localStorage.setItem('typingSfx', state);
          break;
      }

      const response = await axios.patch('http://anihuu.moe:8880/settings', this.user, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
      });
    },
  }
}

</script>

<style scoped>

.settings {
  min-height: 100vh;
  width: 100%;
}

.settingsArea {
  width: calc(100% - 56px);
  background: #F3F3F3;
  height: inherit;
  transform: translateX(56px);
  height: calc(100vh - 60px);
  padding-top: 60px;
}

.option {
  display: flex;
  text-decoration: none;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
}

.option div, .optionBox .top .heading {
  display: flex;
}

.option div img, .optionBox .top .heading img {
  width: 32px;
  height: 32px;
}

.option div h1, .optionBox .top .heading h1 {
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

  margin-left: 12px;
}

.onOff {
  height: 24px;
  border-radius: 64px;
  background: #141520;
  width: 112px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.onOff button {
  border: none;
  cursor: pointer;
  outline: none;
  background: transparent;
  color: white;
  text-transform: uppercase;
  font-weight: 700;
  width: calc(50% + 4px);
  height: calc(100% + 4px);
  border-radius: 24px;
}

.active {
  background: #FF006B !important;
}

.splitter {
  width: calc(100% - 32px);
  height: 1px;
  background: #D4D4D4;
  position: relative;
  margin-top: 16px;
  left: 16px;
}

.optionBox {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin-top: 24px;
  margin-left: 16px;
  margin-right: 16px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.optionBox div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom {
  margin-top: 16px;
  background: #F3F3F3;
  border-radius: 8px;
  height: 38px;
}

.bottom p {
  font-weight: 500;
  font-size: 14px;
  text-indent: 16px;
}

</style>