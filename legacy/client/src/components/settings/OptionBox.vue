<template>
    <div class="optionBox" >
        <div class="top">
            <div class="heading">
                <div>
                    <img v-if="showIcon" :src="require(`../../assets/${option.toLowerCase().replace(/\s/g, '_')}.png`)" :alt="optionTitle">
                    <h1>{{optionTitle}}</h1>

                </div>
                <div v-if="toggleButtons" class="onOff" :style="themeColors">
                    <button  @click="toggleOption(true, option.toLowerCase().replace(/\s/g, '_'))" :class="{'active': optionValue == true}">{{translation("on")}}</button>
                    <button  @click="toggleOption(false, option.toLowerCase().replace(/\s/g, '_'))" :class="{'active': optionValue == false}">{{translation("off")}}</button>
                </div>
            </div>
        </div>
        <div v-if="showSplitter" class="splitter" ></div>
        <div v-if="showValue" class="bottom">
            <a   v-if="type == 'file' && fileUrl" target="_blank" :href="user.settings[optionCategory][option.toLowerCase().replace(/\s/g, '_')].url"><p>{{user.settings[optionCategory][option.toLowerCase().replace(/\s/g, '_')].url.split("/")[user.settings[optionCategory][option.toLowerCase().replace(/\s/g, '_')].url.split("/").length - 1]}}</p></a>
        <!--  -->    <a   v-if="type == 'file' && !fileUrl" href=""><p>{{translation("Default")}}</p></a>
            <img v-if="type == 'file' && fileUrl" src="../../assets/x.png" alt="" @click="resetSfx(property, option.toLowerCase().replace(/\s/g, '_'))">
            <img v-if="type == 'file' && !fileUrl" src="../../assets/upload.png" alt="" @click="$refs[property].click()">
            <input v-if="type == 'file'" class="fileInput" type="file" :ref="property" accept="audio/*" @change="uploadFile(property, option.toLowerCase().replace(/\s/g, '_'))">
        
            <div v-if="list" class="list" v-for="listItem in listContent" :key="listItem" target="_blank" :href="listItem">
              <div>
                <p>{{listItem}}</p>
              </div>
            </div>
        
        </div>
        <div v-if="type == 'text'" class="bottomTextFields">
            <div style="width: 100%;" v-for="field in fields" :key="field">
                <input 
                    v-if="field.selector"
                    :placeholder="field.placeholder" 
                    class="textField" 
                    v-model="user.settings[optionCategory][option.toLowerCase().replace(/\s/g, '_')][field.selector]"
                    type="text" 
                    :maxlength="field.maxLength"
                    @keyup="updateSettings()"
                >
                <input 
                    v-if="!field.selector"
                    :placeholder="field.placeholder" 
                    class="textField" 
                    v-model="user.settings[optionCategory][option.toLowerCase().replace(/\s/g, '_')]"
                    type="text" 
                    :maxlength="field.maxLength"
                    @keyup="updateSettings()"
                >
            </div>
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
        user:              { type: Object,     required: true   },                    // User object
        type:              { type: String,     required: false, },                    // file/text (to know how to display the css)
        fileUrl:           { type: String,     required: false, },                    // The url of the file for the localStorage
        property:          { type: String,     required: false, },                    // the name of the url variable e.g. "mentionSoundSfx: true" for the localStorage
        darkmode:          { type: String,     required: false  },                    // Darkmode enabled or not
        optionTitle:       { type: String,     required: true   },                    // Title of the option box in their language
        optionCategory:    { type: String,     required: true   },                    // Option category e.g. "Appearance"
        optionValue:       { required: false   },                                     // The value of the option e.g. "user.settings.privacy.blocked_users"
        fields:            { type: Object,     required: false, },                    // The ammount of textbox fields
        showValue:         { type: Boolean,    required: false,    default: false  }, // Is the value shown or not
        showIcon:          { type: Boolean,    required: false,    default: true   }, // Is the icon shown or not
        showSplitter:      { type: Boolean,    required: false,    default: false  }, // Does the OptionBox contain a splitter or not
        toggleButtons:     { type: Boolean,    required: false  },                    // Is the toggle buttons shown or not
        list:              { type: Boolean,    required: false,    default: false  }, // Does the OptionBox contain a list or not
        listContent:       { type: Array ,     required: false  },                    // Contains the list as an array
        option:            { type: String ,    required: true  },                     // the actual name of the option in english
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
      async toggleOption(state, option){
        this.playClick();
        NProgress.start();
        switch (option) {
          case "darkmode":
              this.user.settings.appearance.darkmode = state;
              localStorage.setItem('darkmode', state);
              this.emitter.emit('updateUI');
              break;
          case "typing":
              this.user.settings.sounds.typing.enabled = state;
              if (localStorage.typingSoundUrl) localStorage.setItem('typingSoundUrl', this.user.settings.sounds.typing.url);
              localStorage.setItem('typing_sfx', state);
              break;
          case "mention":
              this.user.settings.sounds.mention.enabled = state;
              if (localStorage.mentionSoundUrl) localStorage.setItem('mentionSoundUrl', this.user.settings.sounds.mention.url);
              localStorage.setItem('mention_sfx', state);
              break;
          case "notification":
              this.user.settings.sounds.notification.enabled = state;
              if (localStorage.notificationSoundUrl) localStorage.setItem('notificationSoundUrl', this.user.settings.sounds.notification.url);
              localStorage.setItem('notification_sfx', state);
              break;
          case "hover":
              this.user.settings.sounds.hover.enabled = state;
              if (localStorage.hoverSoundUrl) localStorage.setItem('hoverSoundUrl', this.user.settings.sounds.hover.url);
              localStorage.setItem('hover_sfx', state);
              break;
          case "click":
              this.user.settings.sounds.click.enabled = state;
              if (localStorage.clickSoundUrl) localStorage.setItem('clickSoundUrl', this.user.settings.sounds.click.url);
              localStorage.setItem('click_sfx', state);
              break;
          case "show_status":
              this.user.settings.privacy.show_status = state
              break;
          case "flare":
              this.user.settings.appearance.flare.enabled = state;
          break;
        }
        NProgress.done();
        this.updateSettings();
      },
      async updateSettings(){
          NProgress.start();
          
          console.log(this.user.settings.sounds);
          
          const response = await axios.post('http://localhost:2087/settings', this.user, {
              withCredentials: true,
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          
          this.emitter.emit('updateUI');
          NProgress.done();
      },
      async resetSfx(fileUrl, option){
          localStorage.removeItem(fileUrl);
          this[fileUrl] = localStorage[fileUrl];

          console.log(fileUrl);

          this.user.settings.sounds[option].url = '';
          this.updateSettings();
      },
      async uploadFile(ref, option){
          NProgress.start();

          const file = this.$refs[ref].files[0];

          let formData = new FormData();
          formData.append('audio', file);

          const response = await axios.post('http://localhost:2087/settings/upload', formData, {
              withCredentials: true,
              headers: {
              'Content-Type': 'multipart/form-data'
              }
          });

          let link = response.data.link;

          if (response.status == 200) {
              switch (option) {
              case "typing":
                  localStorage.setItem('typingSoundUrl', link);
                  this.typingSoundUrl = localStorage.typingSoundUrl;
                  this.user.settings.sounds.typing.url = link;
                  break;
              case "mention":
                  localStorage.setItem('mentionSoundUrl', link);
                  this.mentionSoundUrl = localStorage.mentionSoundUrl;
                  this.user.settings.sounds.mention.url = link;
                  break;
              }
              NProgress.done();
              this.updateSettings();
          }
      },
    }
}

</script>

<style scoped>


.optionBox {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin: 8px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
  width: calc(100% - 48px);
}

.optionBox.darkmode { /* darkmode */
  background: #10121D;
  color: white;
} 

.optionBox.darkmode .top .heading img                                       { filter: invert(1); }      /* darkmode */ 
.optionBox.darkmode .bottom, .optionBox.darkmode .textField                 { background: #171A28; }  /* darkmode */
.optionBox.darkmode .bottom a:not(:hover), .optionBox.darkmode .textField   { color: white; }         /* darkmode */
.optionBox.darkmode .bottom img:not(:hover)                                 { filter: invert(1); }      /* darkmode */

.optionBox div {
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
  width: 32px;
  height: 32px;
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

.onOff:hover { 
    background: var(--themeColorHover) !important;
}

.onOff button {
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    color: white;
    text-transform: uppercase;
    font-weight: 700;
    width: calc(50% + 4px);
    height: calc(100% + 4px);
    border-radius: 24px;
}

.active { 
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
