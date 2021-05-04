<template>
    <div class="connectionBox" :class="{darkmode: darkmode == 'true'}">
        <div class="top">
            <div class="heading">
                <div>
                    <img :src="require(`@/assets/platforms/${connectionPlatform}.png`)">
                    <h1>{{connectionPlatform}}</h1>
                </div>
                <button  @click="unlink(connectionPlatform)" :style="themeColors">{{translation("unlink")}}</button>
            </div>
        </div>
        <div class="bottom">
            <p>{{connectionPlatformDetails.username}} - {{connectionPlatformDetails.id}}</p>
        </div>
    </div>
</template>

<script>

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

import axios from 'axios';

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        user:                       { type: Object,     required: true    },                    // User object
        darkmode:                   { type: String,     required: false   },                    // Darkmode enabled or not
        showSplitter:               { type: Boolean,    required: false,    default: false  },  // Does the connectionBox contain a splitter or not
        connectionPlatform:         { type: String,     required: true    },                    // Title of the option box
        connectionPlatformDetails:  { type: Object,     required: false   },                    // Title of the option box
    },
    data: () => {
        return {
        };
    },
    created(){
        this.themeColors = {
            '--themeColor': this.user.settings.appearance.theme_color,
            '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
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
        playClick(){
          if (localStorage.click_sfx == 'false') return
          if (!this.clickSoundUrl) this.clickSoundUrl = require("../../../public/click.wav");
          this.clickSound = new Audio(this.clickSoundUrl);
          this.clickSound.play();
        },
        playHover(){
          if (localStorage.hover_sfx == 'false') return
          if (!this.hoverSoundUrl) this.hoverSoundUrl = require("../../../public/hover.wav");
          this.hoverSound = new Audio(this.hoverSoundUrl);
          this.hoverSound.play();
        },
        async unlink(platform){
          const response = await axios.delete(`https://taku.moe:2087/connections/${platform}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
          });      

          console.log(response);
        },
        async updateSettings(){
            NProgress.start();
            const response = await axios.post('https://taku.moe:2087/settings', this.user, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.emitter.emit('updateUI');
            NProgress.done();
        },
    }
}

</script>

<style scoped>


.connectionBox {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin: 8px ​0px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
  width: calc(100% - 48px);
}

.connectionBox.darkmode { /* darkmode */
  background: #10121D;
  color: white;
} 

.connectionBox.darkmode .bottom, .connectionBox.darkmode .textField                 { background: #171A28; }  /* darkmode */
.connectionBox.darkmode .bottom a:not(:hover), .connectionBox.darkmode .textField   { color: white; }         /* darkmode */
.connectionBox.darkmode .bottom img:not(:hover)                                 { filter: invert(1); }      /* darkmode */

.connectionBox div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.heading { 
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.heading img {
  width: 40px;
  height: 40px;
}

.heading p {
  margin-bottom: 64px;
}

.heading h1 {
  font-family: Work Sans, system-ui;;
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

.heading button {
    border: none;
    cursor: pointer;
    outline: none;
    color: white;
    text-transform: uppercase;
    font-weight: 700;
    background: #141520;
    height: 28px;
    padding: 0px 12px;
    border-radius: 24px;
    transition: 100ms ease;
}

.heading button:hover {
    background: var(--themeColor) !important;
}

.bottom {
  margin-top: 16px;
  background: #F3F3F3;
  border-radius: 8px;
  min-height: 38px;
  overflow: hidden;
  padding: 0px 12px;
}

.bottom a {
  text-decoration: none;
  color: black;
  transition: 100ms ease;
  /* margin-left: 16px; */
}

.bottom a:hover { color: var(--themeColor); }

.bottom p {
  font-weight: 500;
  font-size: 14px;
  /* text-indent: 16px; */
}

.bottom a p {
  font-weight: 500;
  font-size: 14px;
}

.bottom img {
  width: 24px;
  height: 24px;
  /* margin-right: 8px; */
  cursor: pointer;
}

.bottom img:hover { filter: invert(13%) sepia(79%) saturate(5683%) hue-rotate(327deg) brightness(104%) contrast(114%); }
.bottom .fileInput { display: none; }

.bottom.blockedUsers {
  display: flex;
  flex-direction: column;
}

.bottom.devs {
  flex-direction: column;
  display: flex;
  font-size: 4px;
  align-items: left;
}

.bottomTextFields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.textField {
  border: none;
  background: #F3F3F3;
  /* border-bottom: 2px solid black; */
  outline: none;
  margin-top: 16px;
  text-indent: 16px;
  width: 100%;
  color: black;
  font-weight: 500;
  font-size: 14px;
  min-height: 38px;
  border-radius: 8px;
  min-width: 0px;
}

.textField::placeholder {
  color: #575b77;
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

.listItem {
  display: flex;
  margin-left: 0px !important;
  padding: 8px 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

</style>
