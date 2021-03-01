<template>
  <div class="channelsContainer" :class="{darkmode: darkmode == 'true'}">
    <div class="search">
      <h1>Chats</h1>
        <div class="searchBox">
          <transition name="slide-fade">
            <input v-if="isSearching" class="searchField" spellcheck="false" :placeholder="translation('Search')" v-model="searchString" @keyup="filterSearch()">
          </transition>
          <img @click="toggleSearch()" src="../assets/search.svg" alt="">
        </div>
      <!-- <transition name="shrink">
        <img v-if="!isSearching" @click="toggleSearch()" src="../assets/search.svg" alt="">
      </transition> -->
    </div>
    <menu>
      <div @click="view = 'private'" :class="{'active': view == 'private'}">
        PRIVATE
        <div class="line"></div>
      </div>
      <div @click="view = 'group'" :class="{'active': view == 'group'}">
        GROUPS
        <div class="line"></div>
      </div>
    </menu>
    <section>
      <h1 v-if="privateChannels.length != 0 && view == 'private'">USERS</h1>
      <h1 v-if="groupChannels.length != 0 && view == 'group'">GROUPS</h1>
    </section>

    <div class="emptyMessage" v-if="privateChannels.length == 0 && view == 'private'">  
      <h1 class="message">You don't have any dms!</h1>
      <h1 class="emoji">(｡•́︿•̀｡)</h1>
    </div>

    <div class="emptyMessage" v-if="groupChannels.length == 0 && view == 'group'">  
      <h1 class="message">You don't have any group chats!</h1>
      <h1 class="emoji">(｡•́︿•̀｡)</h1>
    </div>

    <div class="emptyMessage" v-if="privateChannels.length != 0 && searchString.length > 0 && searchDMS.length == 0 && view == 'private'">  
      <h1 class="message">I didn't find anyone!</h1>
      <h1 class="emoji">｡･ﾟﾟ*(>д&lt;)*ﾟﾟ･｡</h1>
    </div>

    <div class="emptyMessage" v-if="groupChannels.length != 0 && searchString.length > 0 && searchGroups.length == 0 && view == 'group'">  
      <h1 class="message">I didn't find any groups!</h1>
      <h1 class="emoji">(╥﹏╥)</h1>
    </div>

    <div class="channels">
      <router-link :to="`/messages/private/${channel.uuid}`" v-if="view == 'private'" class="channel" v-for="channel in searchDMS" :key="channel">
        <router-link :to="`/profile/${channel.memberList[0].username}`"><img class="channelPfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt=""></router-link>
        <div class="info">
          <div v-if="!channel.king">
            <h1>{{channel.memberList[0].username}}</h1>
            <div class="channelStatus">
              <div class="icon"></div>
              <p v-if="channel.lastMessage" class="lastMessage">{{channel.lastMessage.content}}</p>
            </div>
          </div>
        </div>
      </router-link>

      <div class="channel" v-for="channel in groupChannels" v-if="view == 'group'" :key="channel">
        <!-- <router-link v-if="!channel.king" :to="`/profile/${channel.memberList[0].username}`"><img class="pfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt=""></router-link> -->
        <div class="info">
          <div v-if="channel.king">
            <router-link :to="`/group/${channel.uuid}`"><h1>{{channel.uuid}}</h1></router-link>
            <div class="channelStatus">
              <div class="icon"></div>
              <p v-if="channel.lastMessage" class="lastMessage">{{channel.lastMessage.content}}</p>
            </div>
          </div>  
        </div>
      </div>
    </div>
  </div>
  <Chat/>
</template>
 
<script>
import axios from 'axios';
import io from 'socket.io-client';
import linkifyHtml from 'linkifyjs/html';

import Chat from '@/components/Chat.vue';

export default {
  name: 'home',
  components: {
    Chat,
  },
  data: () => {
    return {
      me: JSON.parse(localStorage.me),
      dms: [],
      socket: io('ws://taku.moe:8880'),
      channels: [],
      privateChannels: [],
      groupChannels: [],
      searchDMS: [],
      searchGroups: [],
      searchString: '',
      view: 'private',
      darkmode: localStorage.darkmode,
      isSearching: false,
    };
  },
  mounted() {
    this.getChannels();
    this.sortChannels();
  },
  methods: {

    // Sorts the channels in array based on lastMessages 
    // But shit doesn't work and idk why, imma go fetch some braincells
    // TODO: fix the sort function
    sortChannels() {
      this.privateChannels.sort(function(a, b) {
        return b.lastMessage.created_at - a.lastMessage.created_at;
      });
      console.log(this.privateChannels);

      // After all the channels are sorted, run filterSearch
      this.filterSearch();
    },

    // Filter users/groups to searchIndex
    filterSearch() {

      // Reset arrays to empty
      this.searchDMS = [];
      this.searchGroups = [];
      // If search results are empty, make them identical to all results
      if (this.searchString.length == 0) {
        this.searchDMS = this.privateChannels;
        this.searchGroups = this.groupChannels;
        return
      }
      // If the string is found in any dm persons username, it is added to search results
      this.privateChannels.forEach(dm => {
        if(dm.memberList[0].username.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchDMS.push(dm);
      });
      // Now this would only fetch the first users username from the group :kekw:
      this.groupChannels.forEach(group => {
        if(group.memberList[0].username.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchGroups.push(group);
      });
    },

    // Fetches right translation of the site
    translation(sentence){
        if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
        else this.languageTable = require(`@/languages/${localStorage.language}.json`);
        let translatedSentence = this.languageTable[sentence];
        if (!translatedSentence) return sentence;
        return translatedSentence;
    },

    // Toggles the search function
    toggleSearch() {
      this.isSearching = !this.isSearching;
      this.searchString = '';
      this.filterSearch();
    },

    // Return list of channels this user is in
    async getChannels(){
      try {
          var response = await axios.get(`http://taku.moe:8880/channels`, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.status = 401) {
          localStorage.clear();
          window.location.href = "http://taku.moe:8080/login";
          return
        }
      }

      let channels = [];
      for (let channel of response.data.channels){
        let memberList = [];

        for (let member of channel.memberList){
          if (member.uuid != this.me.uuid) memberList.push(member);
        }
        
        channel.memberList = memberList;

        if (channel.memberList.length == 1) this.privateChannels.push(channel);
        if (channel.memberList.length >= 2) this.groupChannels.push(channel);
      }

      response.data.channels = channels;

      this.channels = response.data.channels;
      this.filterSearch();
    }
  }
}

</script>

<style>

/* what happens when the animation is currently active */
.slide-fade-enter-active {
  transform: translateX(256px);
}

/* where it will end up when the entering animation is done */
.slide-fade-enter-to {
  transform: translateX(0px);
  transition: all .3s ease;
}

/* apply the transition to the exit animation only when its active so it doesn't snap */
.slide-fade-leave-active {
  transition: all .3s ease;
}

/* where the leaving animation finishes off */
.slide-fade-leave-to {
  transform: translateX(256px);
}

.shrink-enter-active {
  transform: scale(0.75);
}

.shrink-leave-active {
  transition: all .3s ease;
}

.shrink-enter-to {
  transform: scale(1);
  transition: all .3s ease;
}

.shrink-leave-to {
  transform: scale(0.75);
}

.channelsContainer {
  background: white;
  width: 320px;
  min-width: 320px;
  border-right: #F1F2F4 2px solid;
}

.channelsContainer.darkmode{
  background: #676E78;
  height: 100%;
}

.search { 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  height: 80px;
  border-bottom: 2px solid #F1F2F4;
} 

.search h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: #2C394A;
}

.search img {
  width: 32px;
  height: 32px;
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
  cursor: pointer;
}

.searchBox {
    width: inherit;
    display: flex;
    position: relative;
    padding-left: 16px;
    align-items: center;
}

/* .searchBox img {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-right: 12px;
    margin-top: 10px;
} */

.searchField::placeholder {
    letter-spacing: 1px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 1;
}

.searchField:focus {
    outline: none;
}

.searchField.img {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-left: 12px;
    margin-top: 10px;
}

.searchField {
    text-indent: 16px;
    width: 100%;
    max-width: 600px;
    min-width: 16px;
    height: 39px;
    background: rgba(65, 63, 87, 0.25);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding-left: 24px;
    margin-right: 14px;
}

menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px
}

menu div {
  width: 100%;
  cursor: pointer;
}

menu div.active {
  color: var(--themeColor);
}

menu div .line {
  height: 3px;
  border-radius: 32px;
  width: 0%;
  margin-top: 2px;
  transition: 200ms ease;
}

menu div.active .line {
  background: var(--themeColor);
  width: 40%;
}

section {
  padding: 0px 16px;
  width: 320px;
  height: 32px;
  display: flex;
  align-items: center;
  text-align: center;
}

menu div, section h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 117.9%;

  color: #81859D;
}

/* .channels {
  padding: 16px;
  display: grid;
  gap: 16px;
} */

.emptyMessage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(244px);
}

.emptyMessage .message {
  margin-bottom: 12px;
  color: #81859D;
}

.emptyMessage .emoji {
  font-size: 32px;
  color: #81859D;
}

.channel {
  width: 100%;
  display: flex;
  padding: 8px 16px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  border-right: 0px solid #ff006b;
  overflow: hidden;
}

.channel a {
  width: 48px;
  height: 48px
}

.channel:hover {
  background: #FFF0F6;
  transform: scale(1.04);
}


.channel.router-link-active {
  border-right: 4px solid #ff006b;
}

.channelPfp {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 16px;
  object-fit: cover;
}

.info {
  padding: 4px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  margin-left: 16px;
  width: 60%;
}

.info a {
  width: fit-content;
  text-decoration: none;

}

.info a, h1{
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 117.9%;
  /* identical to box height, or 17px */

  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: left;

  color: #2C394A;
}

.channelStatus {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.channelStatus .icon {
  position: static;
  width: 20px;
  min-width: 20px;
  height: 10px;

  border: 3px solid #7FE876;
  box-sizing: border-box;
  border-radius: 56px;
}

.channelStatus .lastMessage {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #81859D;
  margin: 0px 4px;
}

</style>