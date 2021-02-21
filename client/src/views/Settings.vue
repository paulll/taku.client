<template>
  <div class="settings">
    <div v-if="user.settings">
      <SettingsBar :themeColor="user.settings.appearance.theme_color"/>
    </div>

    <div v-if="user.settings" class="settingsArea" :class="{darkmode: darkmode == 'true'}">

      <!-- Account -->
      <div v-if="user.settings.account && path == 'account'" class="section account">
        <!-- <img class="pfp" :src="user.profile.pfp" alt=""> -->
        <OptionBox  :optionCategory="path" type="text"  :darkmode="darkmode" :user="user" optionTitle="Username"  :showValue="true" :optionValue="user.username"/>
        <OptionBox  :optionCategory="path" type="text"  :darkmode="darkmode" :user="user" optionTitle="Email"     :showValue="true" :optionValue="user.email"/>
        <OptionBox  :optionCategory="path" type="text"  :darkmode="darkmode" :user="user" optionTitle="Password"  :showValue="true"  optionValue="**************"/>
      </div>

      <!-- Appearance -->
      <div v-if="user.settings.appearance && path == 'appearance'" class="section appearance" :class="{darkmode: darkmode == 'true'}">
        <OptionBox  :user="user"                        :darkmode="darkmode"               optionTitle="Darkmode"     :optionCategory="path"  :toggleButtons="true"                                         :optionValue="user.settings.appearance.darkmode"/>
        <OptionBox  :toggleButtons="true"  type="text"  :darkmode="darkmode" :user="user"  optionTitle="Flare"        :optionCategory="path"  :optionValue="user.settings.appearance.flare.enabled"         :fields="[{placeholder: 'e.g. Shimakaze', selector: 'content', maxLength: 32 }, {placeholder: 'e.g. #ff0022', selector: 'color', maxLength: 7}, ]"/>
        <OptionBox  :toggleButtons="false" type="text"  :darkmode="darkmode" :user="user"  optionTitle="Theme Color"  :optionCategory="path"  :optionValue="user.settings.appearance.theme_color"           :fields="[{placeholder: 'e.g. #ff0022', maxLength: 7 }]"/>
      </div>
      
      <!-- Sounds -->
      <div v-if="user.settings.sounds && path == 'sounds'" class="section sounds" :class="{darkmode: darkmode == 'true'}">
        <OptionBox  :fileUrl="typingSoundUrl"       :toggleButtons="true"  type="file"  :darkmode="darkmode" :user="user"  property="typingSoundUrl"       :optionValue="user.settings.sounds?.typing.enabled"        optionTitle="Typing"   :optionCategory="path"     :showValue="true"/>
        <OptionBox  :fileUrl="mentionSoundUrl"      :toggleButtons="true"  type="file"  :darkmode="darkmode" :user="user"  property="mentionSoundUrl"      :optionValue="user.settings.sounds?.mention.enabled"       :optionCategory="path" optionTitle="Mention"      :showValue="true"/>
        <OptionBox  :fileUrl="notificationSoundUrl" :toggleButtons="true"  type="file"  :darkmode="darkmode" :user="user"  property="notificationSoundUrl" :optionValue="user.settings.sounds?.notification?.enabled" :optionCategory="path" optionTitle="Notification" :showValue="true"/>
        <OptionBox  :fileUrl="hoverSoundUrl"        :toggleButtons="true"  type="file"  :darkmode="darkmode" :user="user"  property="hoverSoundUrl" :optionValue="user.settings.sounds?.hover?.enabled" :optionCategory="path" optionTitle="Hover" :showValue="true"/>
        <OptionBox  :fileUrl="clickSoundUrl"        :toggleButtons="true"  type="file"  :darkmode="darkmode" :user="user"  property="clickSoundUrl" :optionValue="user.settings.sounds?.click?.enabled" :optionCategory="path" optionTitle="Click" :showValue="true"/>
      </div>

      <!-- Privacy -->
      <div v-if="user.settings.privacy && path == 'privacy'" class="section privacy" :class="{darkmode: darkmode == 'true'}">
        <OptionBox  :user="user" :darkmode="darkmode" optionTitle="Show Status"  :optionCategory="path"   :toggleButtons="true"   :optionValue="user.settings.privacy.show_status"/>
        <OptionBox  :user="user" :darkmode="darkmode" optionTitle="Blocked Users"  :optionCategory="path"   :listContent="user.settings.privacy.blocked_users" :showValue="true" :list="true" />
      </div>

      <!-- Info -->
      <div v-if="path == 'info'" class="section info">
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/user.png" alt="darkmode">
              <h1>WHO WE ARE</h1>
            </div>
          </div>
        </div>
      </div>

      <!-- acknowledgements -->
      <div v-if="path == 'acknowledgements'" class="section acknowledgements">
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/dev.png" alt="darkmode">
              <h1>Developers</h1>
            </div>
          </div>
          <div class="splitter" :class="{darkmode: darkmode == 'true'}"></div>
          <div class="devsBottom">
            <div class="credits" :class="{darkmode: darkmode == 'true'}" v-for="user in credits" :key="user">
              <p><router-link :to="`/profile/${user.user}`"><strong>{{user.user}}</strong></router-link> - {{user.role}}</p>
            </div>
          </div>
        </div>
        
        <!-- libraries -->
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/library.png" alt="darkmode">
              <h1>Libraries</h1>
            </div>
          </div>
          <div class="splitter" :class="{darkmode: darkmode == 'true'}"></div>
          <div class="devsBottom">
            <div class="credits" :class="{darkmode: darkmode == 'true'}" v-for="lib in libraries" :key="lib">
              <img class="libIcon" :src="lib.img" alt="darkmode">
              <p><a :href="lib.link" target="_blank"><strong>{{lib.lib}}</strong></a> - {{lib.creator}}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Guidelines -->
      <div v-if="path == 'guidelines'" class="section guidelines">
        <Guidelines/>
      </div>
    </div>
  </div>
</template>
<script>
import SettingsBar from '@/components/SettingsBar.vue'
import MobileHeader from '@/components/MobileHeader.vue'

import OptionBox from '@/components/settings/OptionBox.vue'
import Guidelines from '@/components/settings/Guidelines.vue'

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

import axios from 'axios';
import mitt from 'mitt';

const emitter = mitt();

export default {
  name: 'home',
  components: {
    SettingsBar,
    OptionBox,
    Guidelines
  },
  data: () => {
    return {
      path: "",
      // These 2 should be moved to the backend later so we can easily add more things as we go along
      // so its easy to just update the site without having to hardcode it all
      // So yeah make this dynamic // Ephemeral
      credits: [
        // {user: "Bustean",           role: "idk he 3d doing something"},
        {user: "Geoxor",            role: "Head Programmer  / UI & UX Designer"},
        {user: "N1kO23",            role: "Front-end Programmer"},
        {user: "bearr",             role: "Front-end Programmer"},
        {user: "JPEG",              role: "UI/UX Assistant"},
        {user: "SVRGE",             role: "UI Assistant"},
        {user: "MihaiStreames",     role: "UI Assistant"},
      ],
      libraries: [
        {lib: "express",    creator: "express",       img: require("../assets/libraries/express.png"),   link: "https://expressjs.com/"},
        {lib: "mongodb",    creator: "mongodb",       img: require("../assets/libraries/mongodb.png"),   link: "https://www.mongodb.com/"},
        {lib: "Node.js",    creator: "Node.js",       img: require("../assets/libraries/nodejs.png"),    link: "https://nodejs.org/en/"},
        {lib: "Vue.js",     creator: "Vue.js",        img: require("../assets/libraries/vue.png"),       link: "https://vuejs.org/"},
        {lib: "JWT",        creator: "auth0",         img: require("../assets/libraries/jwt.svg"),       link: "https://jwt.io/"},
        {lib: "Jimp",       creator: "oliver-moran",  img: require("../assets/libraries/jimp.png"),      link: "https://www.npmjs.com/package/jimp"},
        {lib: "Joi",        creator: "sideway",       img: require("../assets/libraries/joi.png"),       link: "https://www.npmjs.com/package/joi"},
        {lib: "Nprogress",  creator: "rstacruz",      img: require("../assets/libraries/nprogress.png"), link: "https://ricostacruz.com/nprogress/"},
      ],
      user: {
      },
      typingSoundUrl: localStorage.typingSoundUrl,
      mentionSoundUrl: localStorage.mentionSoundUrl,
      darkmode: localStorage.darkmode,
    };
  },
  watch: {
    $route(to, from) {
      this.path = to.params.setting;
    }
  },
  mounted() {
    this.path = this.$route.params.setting;
    this.getUser();

    this.emitter.on('updateUI', () => this.updateUI());
  },
  methods: {
    async getUser() {
      const user = await axios.get('http://taku.moe:8880/user', {
        withCredentials: true,
      });

      // Add the new settings structure on the user
      // This is here so old users don't have an issue with loading the settings
      // Once they will update their settings this will go on their database
      // In v1.0 this should be removed
      if (!user.data.settings.appearance) {
        user.data.settings.appearance = {
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

      // if (user.data.setting.appearance.theme_color == "") user.data.setting.appearance.theme_color = "#ff006b";

      if (!user.data.settings.appearance.flare) {
        user.data.settings.appearance.flare = {
          enabled: false,
          content: "",
          color: "#ffffff"
        }
      }

      this.user = user.data;
    },
    updateUI(){
      this.darkmode = localStorage.darkmode;
      this.typingSoundUrl = localStorage.typingSoundUrl;
      this.mentionSoundUrl = localStorage.mentionSoundUrl;
    },
  }
}

</script>

<style scoped>

*::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 

}
*::-webkit-scrollbar-track {
  background-color: transparent; 
}
*::-webkit-scrollbar-thumb {
  background-color: #888888;
  border: 5px solid #F3F3F3; 
  border-radius: 16px;
}

*.darkmode::-webkit-scrollbar-thumb {
  background-color: #363952;
  border: 5px solid #08090E; 
}

.settings {
  min-height: 100vh;
  width: 100%;
}


.settingsArea {
  width: calc(100% - 32px);
  background: #F3F3F3;
  height: inherit;
  transform: translateX(56px);
  height: calc(100vh - 60px);
  padding-top: 60px;
  transition: 100ms ease;
  overflow-y: scroll;
}

.settingsArea.darkmode { background: #08090E; } /* darkmode */ 


/* vvv TO BE REMOVED */

.pfp {
  width: 122px;
  height: 122px;
  border-radius: 100%;
}

.usernameBottom {
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
}

.devsBottom {
  display: flex;
  flex-direction: column;
}

.credits {
  width: 100%;
  font-size: 14px;
  font-weight: 400;
}

.credits strong {
  font-weight: 700;
}

.credits p {
  line-height: 32px
}

.credits a {
  color: black;
  text-decoration: none;
  transition: 100ms ease;
}

.credits.darkmode a {
  color: white;
}

.credits a:hover {
  color: #ff006b;
}

.libIcon {
  width: 32px;
  height: 32px;
  margin: 6px 0px;
  margin-right: 12px;
}

/* ^^^ TO BE REMOVED */

.section {
  width: calc(100% - 16px);
}

.appearance {
  height: inherit;
  scrollbar-color: #888888#F3F3F3 ;
  scrollbar-width: thin;
}

.appearance.darkmode {
  scrollbar-color: #363952#08090E ;
}

.accountSettings {
  height: inherit;
  scrollbar-color: #888888#F3F3F3 ;
  scrollbar-width: thin;
}

.accountSettings.darkmode {
  scrollbar-color: #363952#08090E ;
}

</style>