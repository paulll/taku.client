<template>
  <Channels 
    :view="view"
    :privateChannels="privateChannels" 
    :groupChannels="groupChannels" 
    :inviteChannels="inviteChannels" 
    v-if="settings.messages.isChannellistVisible"
  />
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
import Channels from '@/components/v2/Channels.vue'; 

export default {
  name: 'home',
  components: {
    Chat,
    Channels,
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

</style>