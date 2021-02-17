<template>
  <div class="settings">
    <div v-if="user.settings">
      <SettingsBar :themeColor="user.settings.appearance.theme_color"/>
    </div>

    <div class="settingsArea" :class="{darkmode: darkmode == 'true'}">

      <!-- Account -->
      <div v-if="path == 'account'" class="section account">
        <img class="pfp" :src="user.settings.pfp" alt="">
        <OptionBox :optionCategory="path" type="text" :user="user" optionTitle="Username" :darkmode="darkmode" :optionValue="user.username"/>
        <OptionBox :optionCategory="path" type="text" :user="user" optionTitle="Email"    :darkmode="darkmode" :optionValue="user.email"/>
        <OptionBox :optionCategory="path" type="text" :user="user" optionTitle="Password" :darkmode="darkmode"  optionValue="**************"/>
      </div>

      <!-- Appearance & Sounds -->
      <div v-if="path == 'appearance'" class="section appearanceAndSounds" :class="{darkmode: darkmode == 'true'}">
        <OptionBox :user="user"  :darkmode="darkmode" optionTitle="Darkmode" :optionCategory="path"     :toggleButtons="true"   :optionValue="user.settings.appearance.darkmode"/>
        <OptionBox  :toggleButtons="true"  type="file"  :darkmode="darkmode" :fileUrl="typingSoundUrl"  property="typingSoundUrl"  :user="user"            :optionValue="user.settings.appearance.typing_sfx.enabled"  optionTitle="Typing SFX"  :optionCategory="path"     :showValue="true"/>
        <OptionBox  :toggleButtons="true"  type="file"  :darkmode="darkmode" :fileUrl="mentionSoundUrl" property="mentionSoundUrl" :user="user"            :optionValue="user.settings.appearance.mention_sfx.enabled" :optionCategory="path"    optionTitle="Mention SFX"    :showValue="true"/>
        <OptionBox  :toggleButtons="true"  type="text"  :darkmode="darkmode" :user="user"               optionTitle="Flare"        :optionCategory="path"  :optionValue="user.settings.appearance.flare.enabled"       :fields="[{placeholder: 'e.g. Shimakaze', selector: 'content', maxLength: 32 }, {placeholder: 'e.g. #ff0022', selector: 'color', maxLength: 7}, ]"/>
        <OptionBox  :toggleButtons="false" type="text"  :darkmode="darkmode" :user="user"               optionTitle="Theme Color"  :optionCategory="path"  :optionValue="user.settings.appearance.theme_color"         :fields="[{placeholder: 'e.g. #ff0022', maxLength: 7 }]"/>
      </div>

      <!-- Privacy -->
      <div v-if="path == 'privacy'" class="section privacy">
        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <img src="../assets/activity.png" alt="darkmode">
              <h1>Show Activity</h1>
            </div>
            <div class="onOff">
              <button @click="toggleOption(true, 'activity')" :class="{active: user.settings.privacy.show_activity == true}">on</button>
              <button @click="toggleOption(false, 'activity')" :class="{active: user.settings.privacy.show_activity == false}">off</button>
            </div>
          </div>
        </div>

        <div class="optionBox" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <!-- <img src="../assets/keyboard.png" alt="darkmode"> -->
              <h1>Blocked Users</h1>
            </div>
          </div>
          <div class="bottom blockedUsers">
            <div class="blockedUser" v-for="blockedUser in user.settings.privacy.blocked_users" :key="blockedUser" target="_blank" :href="user.settings.appearance.typing_sfx.url">
              <div>
                <img class="pfp" :src="blockedUser?.pfp" alt="">
                <p>{{blockedUser}}</p>
              </div>
              <img src="../assets/x.png" alt="">
            </div>
          </div>
        </div>
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
        <div class="textHeader" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <h1>GUIDELINES</h1>
            </div>
          </div>
        </div>

        <div class="textParagraph" :class="{darkmode: darkmode == 'true'}">
          <div class="top">
            <div class="heading">
              <p>
              Anihuu was made with the intent of compiling backgrounds and bringing the anime community together.<br>
              <br>
              The guidelines describe what can or can't be done within the platform to ensure the community's experience. If you come across a message that appears to break these rules, please report it to us. We will proceed by issuing warnings, removing the content, or removing the accounts responsible.<br>
              <br>
              The overwhelming majority of people use Anihuu responsibly, so these guidelines may seem obvious. Still, we want to be clear about the expectations for our users.<br>
              <br>
              Here's what you can't or can do:<br>
              <br>
              - Do not organize, participate in, or encourage harassment of others. People can disagree on opinions, but continuous, repetitive, or severe negative comments can cross the line into harassment and are not okay.<br>
              <br>
              - Do not organize, promote, or coordinate hate speech. It’s unacceptable to attack a person or a community based on attributes such as their race, ethnicity, national origin, sex, gender, sexual orientation, religious affiliation, or disabilities.<br>
              <br>
              - Do not make threats of violence or threaten to harm others. This includes indirect threats, as well as sharing or threatening to share someone’s private personal information (also known as doxxing).<br>
              <br>
              Here are some rules for content on Anihuu:<br>
              <br>
              - You may not sexualize minors in any way. This includes sharing content or links which depict minors in a pornographic, sexually suggestive, or violent manner, and includes illustrated or digitally altered pornography that depicts minors (such as lolicon, shotacon, or cub). We report illegal content to the National Center for Missing and Exploited Children.<br>
              <br>
              - You may not share sexually explicit content of other people without their consent, or share or promote sharing of non-consensual intimate imagery (also known as revenge porn) in an attempt to shame or degrade someone.<br>
              <br>
              - You may not share content that glorifies or promotes suicide or self-harm, including any encouragement to others to cut themselves, or embrace eating disorders such as anorexia or bulimia.<br>
              <br>
              - You may not share images of sadistic gore or animal cruelty.<br>
              <br>
              In general, you should not promote, encourage or engage in any illegal behavior. This is very likely to get you kicked off Anihuu, and may get you reported to law enforcement.<br>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SettingsBar from '@/components/SettingsBar.vue'
import MobileHeader from '@/components/MobileHeader.vue'

import OptionBox from '@/components/sub components/OptionBox.vue'

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
    OptionBox
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
      const user = await axios.get('http://anihuu.moe:8880/user', {
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
    async updateSettings(){
      NProgress.start();
      const response = await axios.post('http://anihuu.moe:8880/settings', this.user, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
      });
      NProgress.done();
    },
    async toggleOption(state, option){
      NProgress.start();
      switch (option) {
        case "darkmode":
          this.user.settings.appearance.darkmode = state;
          localStorage.setItem('darkmode', state);
          this.emitter.emit('updateUI');
          break;
        case "typing_sfx":
          this.user.settings.appearance.typing_sfx.enabled = state;
          if (localStorage.typingSoundUrl) localStorage.setItem('typingSoundUrl', this.user.settings.appearance.typing_sfx.url);
          localStorage.setItem('typing_sfx', state);
          break;
        case "mention_sfx":
          this.user.settings.appearance.mention_sfx.enabled = state;
          if (localStorage.mentionSoundUrl) localStorage.setItem('mentionSoundUrl', this.user.settings.appearance.mention_sfx.url);
          localStorage.setItem('mention_sfx', state);
          break;
        case "activity":
          this.user.settings.privacy.show_activity = state
          break;
        case "flare":
          this.user.settings.appearance.flare.enabled = state;
          break;
      }
      NProgress.done();
      this.updateSettings();
    },
    async uploadFile(ref, option){
      NProgress.start();

      const file = this.$refs[ref].files[0];

      let formData = new FormData();
      formData.append('audio', file);

      const response = await axios.post('http://anihuu.moe:8880/settings/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

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
        NProgress.done();
        this.updateSettings();
      }
    },
    async resetSfx(sfx){

      localStorage.removeItem(sfx);
      this[sfx] = localStorage[sfx];

      this.user.settings.appearance[sfx].url = '';
      this.updateSettings();
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
.settings {
  min-height: 100vh;
  width: 100%;
}

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

.section {
  width: calc(100% - 16px);
}

.appearanceAndSounds {
  height: inherit;
  scrollbar-color: #888888#F3F3F3 ;
  scrollbar-width: thin;
}

.appearanceAndSounds.darkmode {
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
.top {
  justify-content: space-between;
}
.bottom {
  justify-content: space-between;
}
.heading p {
  margin-bottom: 64px;
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

.splitter {
  width: 100%;
  height: 1px;
  background: #D4D4D4;
  position: relative;
  margin-top: 12px;
  margin-bottom: 8px;
}

.splitter.darkmode {
  background: #252739;
}


.blockedUser {
  display: flex;
  margin-left: 0px !important;
  padding: 8px 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

</style>