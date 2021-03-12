<template>
  <div class="channelsContainer" :class="{darkmode: darkmode == 'true'}">
    <div>
      <div v-if="callState != 'idle'" class="call">
        {{callInformation.username}} Is calling you!

        <div class="button deny" @click="answer()">
          <div class="iconWrapper">
            <img src="../assets/deny.svg" alt="New Group">
          </div>
        </div>

        <div class="button accept" @click="hangup()">
          <div class="iconWrapper">
            <img src="../assets/checkmark.svg" alt="New Group">
          </div>
        </div>

      </div>

      <div v-if="me.isCalling" class="call">
        Calling {{userToCall.username}}...
      </div>

      <div class="search">
        <h1>Chats</h1>
        <div class="button" :class="{active: isSearching}">
          <input v-if="isSearching" ref="search" class="searchBox" spellcheck="false" placeholder="Search" v-model="searchString" type="text" @keyup="filterSearch()">
          <div class="iconWrapper" @click="toggleSearch(); $refs.search.$el.focus();">
            <img src="../assets/search.svg" alt="Search">
          </div>
        </div>
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
        <div @click="view = 'invites'" :class="{'active': view == 'invites'}">
          INVITES
          <div class="line"></div>
        </div>
      </menu>
      <section>
        <h1 v-if="privateChannels.length != 0 && view == 'private'">USERS</h1>
        <h1 v-if="groupChannels.length != 0 && view == 'group'">GROUPS</h1>
        <h1 v-if="inviteChannels.length != 0 && view == 'invites'">GROUPS</h1>
      </section>

      <div class="emptyMessage" v-if="privateChannels.length == 0 && view == 'private'">  
        <h1 class="message">You don't have any dms!</h1>
        <h1 class="emoji">(｡•́︿•̀｡)</h1>
      </div>

      <div class="emptyMessage" v-if="groupChannels.length == 0 && view == 'group'">  
        <h1 class="message">You don't have any group chats!</h1>
        <h1 class="emoji">(｡•́︿•̀｡)</h1>
      </div>

      <div class="emptyMessage" v-if="inviteChannels.length == 0 && view == 'invites'">  
        <h1 class="message">You don't have any invites!</h1>
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

      <div class="emptyMessage" v-if="inviteChannels.length != 0 && searchString.length > 0 && searchInvites.length == 0 && view == 'invites'">  
        <h1 class="message">I didn't find any invites!</h1>
        <h1 class="emoji">(╥﹏╥)</h1>
      </div>

      <div class="channels">
        <router-link :to="`/messages/private/${channel.uuid}`" :style="{'background': `url('https://taku.moe:2087/banner/${channel.member_list[0].uuid}'), linear-gradient(270deg, #FFBFDE 0%,rgba(255, 255, 255) 100%)`}" v-if="view == 'private'" class="channel" v-for="channel in searchDMS" :key="channel">
          <router-link :to="`/profile/${channel.member_list[0].username}`"><img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link>
          <div class="info">
            <div v-if="!channel.senpai">
              <h1>{{channel.member_list[0].username}}</h1>
              <div class="channelStatus">
                <div class="icon"></div>
                <p v-if="channel.last_message" class="last_message">{{channel.last_message.content}}</p>
              </div>
            </div>
          </div>
        </router-link>

    
        <router-link :to="`/messages/group/${channel.uuid}`" class="channel" :style="{'background': `url('https://taku.moe:2087/banner/${channel.uuid}'), linear-gradient(270deg, #FFBFDE 0%,rgba(255, 255, 255) 100%)`}" v-for="channel in searchGroups" v-if="view == 'group'" :key="channel">
          <!-- <router-link v-if="!channel.senpai" :to="`/profile/${channel.member_list[0].username}`"><img class="pfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link> -->
          <img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.pfp}`" alt="">
          <div class="info">
            <div v-if="channel.senpai">
              <h1>{{channel.name}}</h1>
              <div class="channelStatus">
                <div class="icon"></div>
                <p v-if="channel.status" class="last_message">{{channel.status}}</p>
              </div>
            </div>
          </div>
          <img class="deleteChannel" v-if="channel.type == 'group'" src="../assets/trash.svg" alt="Delete Channel" @click="deleteChannel(channel)">
        </router-link>

        <router-link :to="`/messages/invites/`" class="channel" :style="{'background': `url('https://taku.moe:2087/banner/${channel.uuid}'), linear-gradient(270deg, #FFBFDE 0%,rgba(255, 255, 255) 100%)`}" v-for="channel in searchInvites" v-if="view == 'invites'" :key="channel">
          <!-- <router-link v-if="!channel.senpai" :to="`/profile/${channel.member_list[0].username}`"><img class="pfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link> -->
          <img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.pfp}`" alt="">
          <div class="info">
            <div v-if="channel.senpai">
              <h1>{{channel.name}}</h1>
              <div class="channelStatus">
                <div class="icon"></div>
                <p v-if="channel.status" class="last_message">{{channel.status}}</p>
              </div>
            </div>  
          </div>
        </router-link>

      </div>
    </div>

    <div class="bottomButtons" >
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

    </div>
  </div>
  <div id="video-grid"></div>
  <Chat/>
</template>
 
<script>
import axios from 'axios';
import linkifyHtml from 'linkifyjs/html';
import Chat from '@/components/Chat.vue';
import socket from '@/services/socket.js';
import peer from '@/services/peerjs.js';

export default {
  name: 'home',
  components: {
    Chat,
  },
  data: () => {
    return {
      me: JSON.parse(localStorage.me),
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
      isSearching: false,
      isMakingNewGroup: false,
      newGroupName: "",
      callState: 'idle',
      
      callInformation: null,
      userToCall: null,
    };
  },
  mounted() {
    this.getData();
    this.emitter.on("call", (participants) => this.call(participants));
    socket.on('call', callInformation => {
      this.callState = 'beingCalled';
      this.callInformation = callInformation;
    });
  },
  methods: {   
    async call(participants){
      if(this.me.isCalling || this.callState == 'inCall' || this.callState == 'calling' || this.callState == 'beingCalled') return console.log(`Cannot initialize call in this state!`);
      else console.log(`Call would be initialized now`);

      this.me.isCalling = true;
      this.callState == 'inCall';
      this.userToCall = participants[0];
      console.log(participants);

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

      // const myPeer = new Peer({

      // });

      console.log(peer);

      const myvideo = document.createElement('video');
      myvideo.className = 'videoStream';
      // Mutes monitor feedback
      myvideo.muted = true;


      const peers = {}
      // Create new data stream containing the video data
      const stream = await navigator.mediaDevices.getUserMedia({audio: {
        echoCancellation: false,
        autoGainControl: true,
        noiseCancellation: false
      }, video: true});
      addvideoStream(myvideo, stream);

      peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.className = 'videoStream';
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

    // Toggles the search function
    toggleSearch() {
      this.isSearching = !this.isSearching;
      this.searchString = '';
      this.filterSearch();
    },

    // Return list of channels this user is in
    async getData(){
      try {
        var channelsRequest = await axios.get(`https://taku.moe:2087/channels`, {
          withCredentials: true,
        });
        var invitesRequest = await axios.get(`https://taku.moe:2087/channels/invites`, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.status = 401) {
          localStorage.clear();
          window.location.href = "https://beta.taku.moe/login";
          return
        }
      }

      let channels = [];
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


      // Channels and invites oki
      // channelsRequest.data.channels = channels;
      // this.channels = channelsRequest.data.channels;
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
  height: 48px;
  width: 48px;

  position: relative;

  display: flex;
  align-items: center;
  border-radius: 12px;
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
  background: #F1F2F4;
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
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
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
  height: 44px;
  width: 100%;
  background: transparent;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.searchBox::placeholder { 
  color: #81859D; 
}

.channelsContainer {
  background: white;
  width: 320px;
  min-width: 320px;
  border-right: #F1F2F4 2px solid;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channelsContainer.darkmode{
  background: #676E78;
  height: 100%;
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
  width: 24px;
  height: 24px;
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
  width: 75%;
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
  align-items: center;
}

.channel:not(.router-link-active) {
  background: white !important;
}

.channel:hover:not(.router-link-active) {
  background: #FFF0F6 !important; 
  transform: scale(1.04);
}

.channel:hover { transform: scale(1.04); }

.channel.router-link-active {
  border-right: 4px solid #ff006b;
  background-blend-mode: overlay, normal;
  background-size: fill;
  background-size: cover;
  background-repeat: no-repeat;
}

.channel a {
  width: 48px;
  height: 48px
}

.channelPfp {
  width: 48px;
  height: 48px;
  border-radius: 12px;
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
  margin-top: 8px;
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

.channelStatus .last_message {
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