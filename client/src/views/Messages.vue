<template>
  <div class="channelsContainer" v-if="settings.messages.isChannellistVisible" :class="{darkmode: darkmode == 'true'}">
    <div>
      <div v-if="callState != 'idle'" class="call">
        {{callInformation.username}} {{translation('Is calling you!')}}

        <!-- <div class="button deny" @click="answer()">
          <div class="iconWrapper">
            <img src="../assets/deny.svg" alt="New Group">
          </div>
        </div>

        <div class="button accept" @click="hangup()">
          <div class="iconWrapper">
            <img src="../assets/checkmark.svg" alt="New Group">
          </div>
        </div> -->

      </div>

      <div v-if="me.isCalling" class="call">
        {{translation('Calling')}} {{userToCall.username}}...
      </div>

      <div class="search">
        <div class="button">
          <input ref="search" class="searchBox" spellcheck="false" placeholder="Search users and channels" v-model="searchString" type="text" @keyup="filterSearch()">
          <div class="iconWrapper">
            <img src="../assets/search.svg" alt="Search">
          </div>
        </div>
      </div>
      <menu class="view">
        <div @click="view = 'private'" :class="{'active': view == 'private'}">
          PRIVATE
          <div class="line"></div>
        </div>
        <div @click="view = 'group'" :class="{'active': view == 'group'}">
          GROUPS
          <div class="line"></div>
        </div>
        <div @click="view = 'invites'" :class="{'active': view == 'invites'}">
          INVITES
          <div class="line"></div>
        </div>
      </menu>

      <section v-if="groupChannels.some(channel => channel.isPinned == true)">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75137 13.1617C4.74169 13.4819 4.99473 13.7483 5.31526 13.7566C5.53968 13.7633 5.7681 13.7666 5.99983 13.7666C7.14532 13.7666 8.49248 13.7035 9.5558 13.3608C10.0881 13.1891 10.557 12.9451 10.8937 12.5968C11.2328 12.2461 11.4332 11.7942 11.4332 11.22C11.4332 10.6111 11.1977 10.1423 10.8213 9.78593C10.4477 9.4323 9.9383 9.19205 9.39026 9.0276C8.29467 8.69883 7.01196 8.66377 6.25424 8.65991L6.25377 8.65991L5.85878 8.65977L5.85826 8.65977C4.72154 8.66519 3.40943 8.73949 2.37886 9.08685C1.86289 9.26076 1.41006 9.5055 1.08547 9.85103C0.758645 10.1989 0.566504 10.6443 0.566504 11.2067C0.566504 11.5508 0.647171 11.958 0.921625 12.3438C1.19613 12.7297 1.65821 13.0852 2.40542 13.3367C2.71121 13.4413 3.03978 13.2759 3.1433 12.9745L3.14338 12.9743C3.2466 12.6714 3.08299 12.3434 2.77876 12.2412C2.28909 12.0763 2.02979 11.8838 1.89194 11.705C1.7558 11.5285 1.72986 11.3548 1.72986 11.2067C1.72986 10.7779 2.04342 10.4299 2.75982 10.1856C3.47403 9.94213 4.55325 9.81675 5.99983 9.81675C7.44638 9.81675 8.52549 9.94329 9.23959 10.189C9.95551 10.4353 10.2698 10.7864 10.2698 11.22C10.2698 11.6484 9.95632 11.9962 9.23988 12.2402C8.52565 12.4835 7.44642 12.6087 5.99983 12.6087C5.77925 12.6087 5.56216 12.606 5.34854 12.6L5.34854 12.6L5.34497 12.6C5.03988 12.6024 4.7605 12.8379 4.75137 13.1617ZM4.75137 13.1617C4.75137 13.1618 4.75136 13.1618 4.75136 13.1619L4.85132 13.1647L4.75137 13.1616C4.75137 13.1617 4.75137 13.1617 4.75137 13.1617ZM9.69094 3.90256C9.69094 1.87881 8.03487 0.233313 5.99983 0.233313C3.96482 0.233313 2.30805 1.87879 2.30805 3.90256C2.30805 5.92567 3.96484 7.57114 5.99983 7.57114C8.03486 7.57114 9.69094 5.92565 9.69094 3.90256ZM3.47208 3.90256C3.47208 2.51841 4.60541 1.39129 5.99983 1.39129C7.39426 1.39129 8.52759 2.51841 8.52759 3.90256C8.52759 5.28602 7.39427 6.41316 5.99983 6.41316C4.6054 6.41316 3.47208 5.28602 3.47208 3.90256Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>PINNED</h1>
      </section>

      <section v-if="privateChannels.length != 0 && view == 'private'">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75137 13.1617C4.74169 13.4819 4.99473 13.7483 5.31526 13.7566C5.53968 13.7633 5.7681 13.7666 5.99983 13.7666C7.14532 13.7666 8.49248 13.7035 9.5558 13.3608C10.0881 13.1891 10.557 12.9451 10.8937 12.5968C11.2328 12.2461 11.4332 11.7942 11.4332 11.22C11.4332 10.6111 11.1977 10.1423 10.8213 9.78593C10.4477 9.4323 9.9383 9.19205 9.39026 9.0276C8.29467 8.69883 7.01196 8.66377 6.25424 8.65991L6.25377 8.65991L5.85878 8.65977L5.85826 8.65977C4.72154 8.66519 3.40943 8.73949 2.37886 9.08685C1.86289 9.26076 1.41006 9.5055 1.08547 9.85103C0.758645 10.1989 0.566504 10.6443 0.566504 11.2067C0.566504 11.5508 0.647171 11.958 0.921625 12.3438C1.19613 12.7297 1.65821 13.0852 2.40542 13.3367C2.71121 13.4413 3.03978 13.2759 3.1433 12.9745L3.14338 12.9743C3.2466 12.6714 3.08299 12.3434 2.77876 12.2412C2.28909 12.0763 2.02979 11.8838 1.89194 11.705C1.7558 11.5285 1.72986 11.3548 1.72986 11.2067C1.72986 10.7779 2.04342 10.4299 2.75982 10.1856C3.47403 9.94213 4.55325 9.81675 5.99983 9.81675C7.44638 9.81675 8.52549 9.94329 9.23959 10.189C9.95551 10.4353 10.2698 10.7864 10.2698 11.22C10.2698 11.6484 9.95632 11.9962 9.23988 12.2402C8.52565 12.4835 7.44642 12.6087 5.99983 12.6087C5.77925 12.6087 5.56216 12.606 5.34854 12.6L5.34854 12.6L5.34497 12.6C5.03988 12.6024 4.7605 12.8379 4.75137 13.1617ZM4.75137 13.1617C4.75137 13.1618 4.75136 13.1618 4.75136 13.1619L4.85132 13.1647L4.75137 13.1616C4.75137 13.1617 4.75137 13.1617 4.75137 13.1617ZM9.69094 3.90256C9.69094 1.87881 8.03487 0.233313 5.99983 0.233313C3.96482 0.233313 2.30805 1.87879 2.30805 3.90256C2.30805 5.92567 3.96484 7.57114 5.99983 7.57114C8.03486 7.57114 9.69094 5.92565 9.69094 3.90256ZM3.47208 3.90256C3.47208 2.51841 4.60541 1.39129 5.99983 1.39129C7.39426 1.39129 8.52759 2.51841 8.52759 3.90256C8.52759 5.28602 7.39427 6.41316 5.99983 6.41316C4.6054 6.41316 3.47208 5.28602 3.47208 3.90256Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>USERS</h1>
      </section>
      <section v-if="groupChannels.length != 0 && view == 'group'">
        <h1>GROUPS</h1>
      </section>
      <section v-if="inviteChannels.length != 0 && view == 'invites'">
        <h1>INVITES</h1>
      </section>

      <Takuchii message="You don't have any dms!" emoji="(｡•́︿•̀｡)"         v-if="privateChannels.length == 0 && view == 'private'"/>
      <Takuchii message="You don't have any group chats!" emoji="(｡•́︿•̀｡)" v-if="groupChannels.length == 0 && view == 'group'"/>  
      <Takuchii message="You don't have any invites!" emoji="(｡•́︿•̀｡)"     v-if="inviteChannels.length == 0 && view == 'invites'"/>  
      <Takuchii message="I didn't find anyone!" emoji="｡･ﾟﾟ*(>д&lt;)*ﾟﾟ･｡"    v-if="privateChannels.length != 0 && searchString.length > 0 && searchDMS.length == 0 && view == 'private'"/>  
      <Takuchii message="I didn't find any groups!" emoji="(╥﹏╥)"         v-if="groupChannels.length != 0 && searchString.length > 0 && searchGroups.length == 0 && view == 'group'"/>        
      <Takuchii message="I didn't find any invites!" emoji="(╥﹏╥)"        v-if="inviteChannels.length != 0 && searchString.length > 0 && searchInvites.length == 0 && view == 'invites'"/>        

      <div class="channels">
        <div v-if="view == 'private'">
          <Channel :channel="channel" :type="view" v-for="channel in searchDMS" :key="channel"/>
        </div>
        <div v-if="view == 'group'">
          <Channel :channel="channel" :type="view" v-for="channel in searchGroups" :key="channel"/>
        </div>
      </div>
    </div>

    <!-- <div class="bottomButtons" >
      <div class="button" :class="{active: isMakingNewGroup}">
        <div class="iconWrapper" @click="isMakingNewGroup = !isMakingNewGroup">
          <img src="../assets/newGroup.png" alt="New Group">
        </div>
        <input v-if="isMakingNewGroup" class="searchBox" @enter="makeNewGroup()" placeholder="Group name" v-model="newGroupName" type="text">
      </div>

      <div class="button deny" v-if="isMakingNewGroup" @click="isMakingNewGroup = !isMakingNewGroup; newGroupName = ''">
        <div class="iconWrapper">
          <img src="../assets/deny.svg" alt="New Group">
        </div>
      </div>

      <div class="button accept" v-if="isMakingNewGroup" @click="makeNewGroup()">
        <div class="iconWrapper"> 
          <img src="../assets/checkmark.svg" alt="New Group">
        </div>
      </div>

    </div> -->
  </div>
  <div id="video-grid"></div>
  <Chat v-if="showChat"/>
</template>
 
<script>
import axios from 'axios';
import linkifyHtml from 'linkifyjs/html';
import socket from '@/services/socket.js';
import peer from '@/services/peerjs.js';
import translation from '@/services/translator.js';

// Components
import Chat from '@/components/Chat.vue';
import Channel from '@/components/v2/Channel.vue'; 
import Takuchii from '@/components/v2/Takuchii.vue'; 

export default {
  name: 'home',
  components: {
    Chat,
    Channel,
    Takuchii,
  },
  data: () => {
    return {
      me: JSON.parse(localStorage.me),
      settings: JSON.parse(localStorage.settings),
      dms: [],
      channels: [],
      privateChannels: [],
      groupChannels: [],
      inviteChannels: [],
      searchDMS: [],
      searchGroups: [],
      searchInvites: [],
      searchString: '',
      view: 'private',
      darkmode: localStorage.darkmode,
      isMakingNewGroup: false,
      newGroupName: "",
      callState: 'idle',
      showChat: true,
      callInformation: null,
      userToCall: null,
    };
  },
  mounted() {
    this.loadCache();
    this.getData();
    this.emitter.on("call", (participants) => this.call(participants));
    this.emitter.on('updateUI', () => this.updateUI());
    socket.on('call', callInformation => {
      this.callState = 'beingCalled';
      this.callInformation = callInformation;
    });
  },
  methods: {   
    translation,
    updateUI(){
      this.darkmode = localStorage.darkmode;
      this.settings = JSON.parse(localStorage.settings);
    },
    async call(participants){
      if(this.me.isCalling || this.callState == 'inCall' || this.callState == 'calling' || this.callState == 'beingCalled') return console.log(`Cannot initialize call in this state!`);
      else console.log(`Call would be initialized now`);

      this.me.isCalling = true;
      this.userToCall = participants[0];
      this.callState = 'inCall';
      this.showChat = false;
      const videoGrid = document.getElementById('video-grid');

      // Make a new peer connection
      var peer = new Peer(this.me.uuid, {
        config: {'iceServers': [
          {urls:'stun:stun3.l.google.com:19302'},
          // {url:'stun:stun4.l.google.com:19302'},
          // {url: 'turn:turn.bistri.com:80',credential: 'homeo',username: 'homeo'},
          {urls: 'turn:turn.anyfirewall.com:443?transport=tcp',credential: 'webrtc',username: 'webrtc'}
        ]},
        secure: true,
        host: 'rtc.taku.moe',
        port: '8443'
      }); 

      const myvideo = document.createElement('video');
      myvideo.className = 'videoStream';
      // Mutes monitor feedback
      myvideo.muted = true;
      myvideo.controls = true;

      const peers = {}
      // Create new data stream containing the video data
      const stream = await navigator.mediaDevices.getUserMedia({audio: {
        echoCancellation: false,
        autoGainControl: true,
        noiseCancellation: true,
        channelCount: {max: 2, min: 1},
      }, video: true});
      addvideoStream(myvideo, stream);

      peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.className = 'videoStream';
        video.controls = true;
        call.on('stream', stream => addvideoStream(video, stream));
      });

      socket.on('user_connected', user_uuid => {
        console.log("user_connected", user_uuid);
        connectToNewUser(user_uuid, stream);
      });

      socket.on('user_disconnected', user_uuid => {
        console.log("disconnected", user_uuid);
        if (peers[user_uuid]) peers[user_uuid].close()
      })

      // When the peer is ready send an event on the socket that tells everyone else
      // That I joined the call with my user uuid being peer_uuid
      // peer.on('open', peer_uuid => {
      // });
      socket.emit('join_vc_channel', this.$route.params.channel_uuid, this.me.uuid);

      // Connects to new user
      function connectToNewUser(user_uuid, stream){
        var call = peer.call(user_uuid, stream);
        const video = document.createElement('video');
        video.className = 'videoStream';
        video.controls = true;
        call.on('stream', function(stream) { addvideoStream(video, stream)});
        call.on('close', () => video.remove());
        peers[user_uuid] = call;
      };

      function addvideoStream(video, stream){
        video.srcObject = stream;
        video.onloadedmetadata = event => video.play();
        videoGrid.append(video);
        console.log("Video grid added!");
      }

    },
    async makeNewGroup(){
      this.isMakingNewGroup = false;

      const invite = {
        name: this.newGroupName,
      };

      this.newGroupName = "";

      const response = await axios.post(`https://taku.moe:2087/channels/group`, invite, {
        withCredentials: true
      });

      if (response.status == 201) {
        console.log(response.data);
        this.view = 'group';
        this.groupChannels.push(response.data.channel);
        this.filterSearch();
        this.$router.push({ path: `/messages/group/${response.data.channel.uuid}` })
      }
    },
    async deleteChannel(channel){
      const response = await axios.delete(`https://taku.moe:2087/channels/group/${channel.uuid}`, {
        withCredentials: true
      });

    },
    // Filter users/groups to searchIndex
    filterSearch() {

      // Reset arrays to empty
      this.searchDMS = [];
      this.searchGroups = [];
      this.searchInvites = [];
      // If search results are empty, make them identical to all results
      if (this.searchString.length == 0) {
        this.searchDMS = this.privateChannels;
        this.searchGroups = this.groupChannels;
        this.searchInvites = this.inviteChannels;
        return
      }

      // If the string is found in any dm persons username, it is added to search results
      this.privateChannels.forEach(dm => {
        if(dm.member_list[0].username.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchDMS.push(dm);
      });
      // If the string is found in any group name, it is added to search results
      this.groupChannels.forEach(group => {
        if(group.name.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchGroups.push(group);
      });
      // If the string is found in any invite group name, it is added to search results
      this.inviteChannels.forEach(group => {
        if(group.name.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchInvites.push(group);
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

    // Loads from local storage
    loadCache(){
      this.channels = JSON.parse(localStorage.getItem('channels'));
      this.privateChannels = JSON.parse(localStorage.getItem('privateChannels'));
      this.groupChannels = JSON.parse(localStorage.getItem('groupChannels'));

      // This runs so fucking fast in here
      // Auto update the URL if theres no channel 
      // E.g. if tthe url is https://taku.moe/messages/
      // This will redirect it to the first private channel they have
      if (this.$route.params.channel_uuid == '' && this.privateChannels != null){
        this.$router.push(`/messages/private/${this.privateChannels[0].uuid}`);
      }

      this.filterSearch();
    },

    // Return list of channels this user is in
    async getData(){
      try {
        var channelsRequest = await axios.get(`https://taku.moe:2087/channels`, {withCredentials: true});
        var invitesRequest = await axios.get(`https://taku.moe:2087/channels/invites`, {withCredentials: true});
      } catch (error) {
        if (error.status = 401) {
          localStorage.clear();
          window.location.href = "https://taku.moe/login";
          return
        }
      }

      // Reset this to simply avoid having dupes when merging with cache
      this.channels = [];
      this.privateChannels = [];
      this.groupChannels = [];

      for (let channel of channelsRequest.data.channels){
        let member_list = [];

        for (let member of channel.member_list){
          if (member.uuid != this.me.uuid) member_list.push(member);
        }
        
        channel.member_list = member_list;

        this.channels.push(channel);
        if (channel.type == "dm") this.privateChannels.push(channel);
        if (channel.type == "group") this.groupChannels.push(channel);
      }


      // Store new data in cache
      localStorage.setItem('channels', JSON.stringify(this.channels));
      localStorage.setItem('privateChannels', JSON.stringify(this.privateChannels));
      localStorage.setItem('groupChannels', JSON.stringify(this.groupChannels));


      this.inviteChannels = invitesRequest.data;
      this.filterSearch();
    }
  }
}

</script>

<style scoped>

#video-grid {
  top: 220px;
  right: 350px;
  display: grid;
  width: max-content;
  z-index: 400;
  align-content: center;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

#video-grid img {
  width: 128px;
  height: auto;
}

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

.bottomButtons {
  width: 100%;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 8px;
}

.button {
  cursor: pointer;
  width: fit-content;
  transition: 100ms ease;
  min-width: 48px;
  width: 100%;
  height: 32px;
  position: relative;
  background: var(--light);
  border: transparent 1px solid;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: 100ms ease;
}

.button.accept:hover {
  background: #9aff97;
}

.button.deny:hover {
  background: #ff9797;
}

.button.active {
  width: 100%;
}

.button:hover, .button.active {
  /* background: #F1F2F4; */
  border: var(--hoverOutline) 1px solid;
}

.button .iconWrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.iconWrapper img {
  position: absolute;
  width: 24px;
  transform: translateX(12px);
  height: 24px;
  filter: invert(51%) sepia(1%) saturate(2032%) hue-rotate(191deg) brightness(81%) contrast(80%);
}

.deleteChannel {
  width: 24px;
  transform: translateX(12px);
  height: 24px;
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
}

.searchBox {
  outline: none;
  border: none;
  text-indent: 8px;
  height: 100%;
  width: 100%;
  background: transparent;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  z-index: 3px;
  color: white; 
}

.searchBox::placeholder { 
  color: var(--textDark); 
}

.channelsContainer {
  background: var(--dark);
  width: 320px;
  min-width: 320px;
  color: var(--textDark);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.call {
  height: 80px;
  width: 100%;
  padding: 16px;
  background: #7FE876;
}

.search { 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
} 

.search h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: inherit;
}

.search img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.searchBox {
    display: flex;
    position: relative;
    align-items: center;
}

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

menu.view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
}

menu.view div {
  width: 100%;
  cursor: pointer;
}

menu.view div.active {
  color: var(--themeColor);
}

menu.view div .line {
  height: 3px;
  border-radius: 32px;
  width: 0%;
  margin-top: 2px;
  transition: 200ms ease;
}

menu.view div.active .line {
  background: var(--themeColor);
  width: 75%;
}

section {
  padding: 0px 8px;
  width: 100%;
  height: 32px;
  gap: 8px;
  display: flex;
  align-items: center;
  text-align: center;
}

menu.view div, section h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 117.9%;
}

.channels {
  display: flex;
  gap: 8px;
  flex-direction: column;
} 

</style>