<template>
  <div class="settings">
    <SettingsBar/>

    <div class="settingsArea" :class="{darkmode: darkmode == 'true'}">
      <div v-if="path == 'appearance'" class="appearanceAndSounds">
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/darkmode.png" alt="darkmode">
              <h1>Darkmode</h1>
            </div>
            <div class="onOff">
              <button @click="toggleOption(true, 'darkmode')" :class="{active: user.settings.appearance.darkmode == true}">on</button>
              <button @click="toggleOption(false, 'darkmode')" :class="{active: user.settings.appearance.darkmode == false}">off</button>
            </div>
          </div>
        </div>
        <!-- <div class="splitter"></div> -->
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/keyboard.png" alt="darkmode">
              <h1>Typing SFX</h1>
            </div>
            <div class="onOff">
              <button @click="toggleOption(true, 'typing_sfx')" :class="{active: user.settings.appearance.typing_sfx.enabled == true}">on</button>
              <button @click="toggleOption(false, 'typing_sfx')" :class="{active: user.settings.appearance.typing_sfx.enabled == false}">off</button>
            </div>
          </div>
          <div class="bottom">
            <a v-if="typingSoundUrl" target="_blank" :href="user.settings.appearance.typing_sfx.url"><p>{{user.settings.appearance.typing_sfx.url.split("/")[user.settings.appearance.typing_sfx.url.split("/").length - 1]}}</p></a>
            <a href=""><p v-if="!typingSoundUrl">Default</p></a>
            <img v-if="typingSoundUrl" src="../assets/x.png" alt="" @click="resetSfx('typingSoundUrl')">
            <img v-if="!typingSoundUrl" src="../assets/upload.png" alt="" @click="$refs.keystrokeInput.click()">
            <input class="fileInput" type="file" ref="keystrokeInput" accept="audio/*" @change="uploadFile('keystrokeInput', 'typing_sfx')">
          </div>
        </div>

        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/notification.png" alt="darkmode">
              <h1>Mention SFX</h1>
            </div>
            <div class="onOff">
              <button @click="toggleOption(true, 'mention_sfx')" :class="{active: user.settings.appearance.mention_sfx.enabled == true}">on</button>
              <button @click="toggleOption(false, 'mention_sfx')" :class="{active: user.settings.appearance.mention_sfx.enabled == false}">off</button>
            </div>
          </div>
          <div class="bottom">
            <a v-if="mentionSoundUrl" target="_blank" :href="user.settings.appearance.mention_sfx.url"><p>{{user.settings.appearance.mention_sfx.url.split("/")[user.settings.appearance.mention_sfx.url.split("/").length - 1]}}</p></a>
            <a href=""><p v-if="!mentionSoundUrl">Default</p></a>
            <img v-if="mentionSoundUrl" src="../assets/x.png" alt="" @click="resetSfx('mentionSoundUrl')">
            <img v-if="!mentionSoundUrl" src="../assets/upload.png" alt="" @click="$refs.mentionInput.click()">
            <input class="fileInput" type="file" ref="mentionInput" accept="audio/*" @change="uploadFile('mentionInput', 'mention_sfx')">
          </div>
        </div>
      </div>

      <div v-if="path == 'privacy'" class="privacy">
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/keyboard.png" alt="darkmode">
              <h1>Blocked Users</h1>
            </div>
          </div>
          <div class="bottom blockedUsers">
            <a class="blockedUser" v-for="blockedUser in user.settings.privacy.blocked_users" :key="blockedUser" target="_blank" :href="user.settings.appearance.typing_sfx.url">
              <div>
                <img class="pfp" :src="blockedUser.pfp" alt="">
                <p>{{blockedUser.username}}</p>
              </div>
              <img src="../assets/x.png" alt="" @click="resetSfx()">
            </a>
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
      typingSoundUrl: localStorage.typingSoundUrl,
      mentionSoundUrl: localStorage.mentionSoundUrl,
      darkmode: localStorage.darkmode,
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

    this.emitter.on('updateTheme', () => this.updateTheme());
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
    async updateSettings(){
      const response = await axios.post('http://anihuu.moe:8880/settings', this.user, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
      });
    },
    async toggleOption(state, option){

      switch (option) {
        case "darkmode":
          this.user.settings.appearance.darkmode = state;
          localStorage.setItem('darkmode', state);
          this.emitter.emit('updateTheme');
          break;
        case "typing_sfx":
          this.user.settings.appearance.typing_sfx.enabled = state;
          localStorage.setItem('typingSoundUrl', this.user.settings.appearance.typing_sfx.url);
          localStorage.setItem('typing_sfx', state);
          break;
        case "mention_sfx":
          this.user.settings.appearance.mention_sfx.enabled = state;
          localStorage.setItem('mentionSoundUrl', this.user.settings.appearance.mention_sfx.url);
          localStorage.setItem('mention_sfx', state);
          break;
      }

      this.updateSettings();
    },
    async uploadFile(ref, option){

      const file = this.$refs[ref].files[0];

      let formData = new FormData();
      formData.append('audio', file);

      const response = await axios.post('http://anihuu.moe:8880/settings/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(response.data.link);
      console.log(response.data.link);
      let link = response.data.link;

      if (response.status == 200) {
        switch (option) {
          case "typing_sfx":
            localStorage.setItem('typingSoundUrl', link);
            this.typingSoundUrl = localStorage.typingSoundUrl;
            this.user.settings.appearance.typing_sfx.url = link;
            break;
          case "mention_sfx":
            localStorage.setItem('mentionSoundUrl', link);
            this.mentionSoundUrl = localStorage.mentionSoundUrl;
            this.user.settings.appearance.mention_sfx.url = link;
            break;
        }
        this.updateSettings();
      }
    },
    async resetSfx(sfx){
      localStorage.removeItem(sfx);
      this[sfx] = localStorage[sfx];

      console.log(this.user.settings.appearance);

      this.user.settings.appearance[sfx].url = '';
      this.updateSettings();
    },
    updateTheme(){
      this.darkmode = localStorage.darkmode;
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
  transition: 100ms ease;
}

.settingsArea.darkmode { background: #08090E; } /* darkmode */ 

.option {
  display: flex;
  text-decoration: none;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
}

.option div, .optionBox .top .heading { display: flex;}
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
  transition: 100ms ease;
}

.onOff:hover { background: #810036;}
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

.active { background: #FF006B !important;}
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
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.optionBox.darkmode { /* darkmode */
  background: #10121D;
  color: white;
} 

.optionBox.darkmode .top .heading img         { filter: invert(1); }      /* darkmode */ 
.optionBox.darkmode .bottom                   { background: #171A28; }  /* darkmode */
.optionBox.darkmode .bottom a:not(:hover)     { color: white; }         /* darkmode */
.optionBox.darkmode .bottom img:not(:hover)   { filter: invert(1); }      /* darkmode */

.optionBox div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom {
  margin-top: 16px;
  background: #F3F3F3;
  border-radius: 8px;
  min-height: 38px;
  overflow: hidden;
}

.bottom a {
  text-decoration: none;
  color: black;
  transition: 100ms ease;
  margin-left: 16px;
}

.bottom a:hover { color: #FF006B; }
.bottom a p {
  font-weight: 500;
  font-size: 14px;
}

.bottom img {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  cursor: pointer;
}

.bottom img:hover { filter: invert(13%) sepia(79%) saturate(5683%) hue-rotate(327deg) brightness(104%) contrast(114%); }
.bottom .fileInput { display: none; }

.bottom.blockedUsers {
  display: flex;
  flex-direction: column;
}

.blockedUser {
  display: flex;
  margin-left: 0px !important;
  padding: 8px 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.blockedUser .pfp {
  height: 40px;
  margin: 0px 12px;
  width: 40px;
  border-radius: 100%;
}

</style>