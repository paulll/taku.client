<template>
  <div class="DMs" :class="{darkmode: darkmode == 'true'}" @dragover.prevent @drop.prevent="handleFileDrop" @paste="handleFilePaste">
    <ChatHeader v-if="currentChannel" :channel="currentChannel" />
    <div class="messagesWrapper">
      <div class="messagesContainer">
        <div class="messages" :class="{darkmode: darkmode == 'true'}">
          <div class="message" v-for="message in messages" :key="message" v-bind:class="{me: me.uuid == message.author.uuid, same: message.author.same_as_last}">
            <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('${rootPath}:2087/pfp/${message.author.uuid}')`}"></div></router-link>
            <div class="notch"></div>
            <div class="messageBubble">
              <!-- <h4 class="date">
                <router-link :to='`/profile/${message.author.username}`'>
                  <strong>{{message.author.username}}</strong>
                </router-link> 
                <div class="flare" v-if="message.author.flare && message.author.flare.enabled" :style="{'background': message.author.flare.color}">{{message.author.flare.content}}</div>
                {{convert(message.created_at)}}
              </h4> -->
              <h2 class="content" v-if="message.content.length != 0" :class="{mention: message.content.includes('@') && (message.content.toLowerCase().includes(me.toLowerCase()) || message.content.toLowerCase().includes('everyone')), darkmode: darkmode == 'true'}" v-html="message.content"></h2>
              <div class="content" :class="{darkmode: darkmode == 'true'}" v-for="attachment in message.attachments" :key="attachment" v-html="attachment"></div>
            </div>
          </div>

          <div class="typingUsers">
            <div v-for="pfp of typingUsers" :key="pfp" class="typing" :style="{ 'background-image': `url(${pfp})`}"></div>
          </div>
          

        </div>
        <div class="dummy"></div>
      </div>
    </div>
    <TextInput/>
  </div>
</template>
 
<script>
import axios from 'axios';
import linkifyHtml from 'linkifyjs/html';
import TextInput from '@/components/messages/TextInput.vue';
import ChatHeader from '@/components/ChatHeader.vue';
import translation from '@/services/translator.js';
import socket from '@/services/socket.js';
import Cache from '@/services/cache.js';

const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm

export default {
  name: 'home',
  // props: {
  //   channel_information:   { type: Object, required: true },
  // },
  components: {
    TextInput,
    ChatHeader,
  },
  props: {
    selectedChannel: { type: Object, required: true },
  },
  data: () => {
    return {
      message: "",
      messages: [],
      me: JSON.parse(localStorage.me),
      blockedUsers: [],
      typingUsers: [],
      previews: [],
      attachments: [],
      darkmode: localStorage.darkmode,
      typingSfx: localStorage.typing_sfx,
      typingSoundUrl: localStorage.typingSoundUrl,
      typingSound: '',
      mentionSfx: localStorage.mention_sfx,
      mentionSoundUrl: localStorage.mentionSoundUrl,
      mentionSound: '',
      currentChannel: null,
    };
  },
  watch: {
      $route(to, from) {
        this.loadMessagesFromCache();
        this.getChannel();
        socket.emit('leave_channel', to.params.channel_uuid);
      }
  },
  mounted() {
    this.loadMessagesFromCache();
    this.getBlockedUsers();
    this.getChannel();

        // Load Sounds
    if (!this.typingSoundUrl) this.typingSoundUrl = require("../../public/keystroke.wav");
    this.typingSound = new Audio(this.typingSoundUrl);
    this.typingSound.volume = 0.2;

    if (!this.mentionSoundUrl) this.mentionSoundUrl = require("../../public/mention.wav");
    this.mentionSound = new Audio(this.mentionSoundUrl);

    // setTimeout(() => {
    //   let dummy = document.querySelector(".dummy");
    //   dummy.scrollIntoView({behavior: "smooth"});
    // }, 500);

    let last_message = {
      author: {
        username: "a72bd87a2nh3hjd"
      }
    };

    socket.on('disconnect', function() {
      console.log("[MESSAGE WS] DISCONNECTED!")
    });

    socket.on('message', message => {
      console.log(message);
      if (message.content !== undefined && message.channel_uuid == this.$route.params.channel_uuid) {
        // If the last message is by the same user just add the message content itself without
        // Their username etc
        if (last_message.author.uuid == message.author.uuid) message.author.same_as_last = true;
      
        message.content = this.renderHtml(message.content);
        message.attachments = message.attachments.map(attachment => this.renderHtml(attachment.html, attachment.originalurl, attachment.size));
        
        last_message = message;
        this.messages.unshift(message);

        // Play notification sound if they got mentioned
        if (
          this.mentionSfx == 'true' 
          && message.content.includes('@') 
          && (message.content.toLowerCase().includes(this.me.toLowerCase()) || message.content.toLowerCase().includes("everyone"))
          ){
          window.navigator.vibrate(100);
          this.mentionSound = new Audio(this.mentionSoundUrl);
          this.mentionSound.currentTime = 0;
          this.mentionSound.play();
        };

        this.last_message = message;

        // Remove this later but for now its here to only show the last 20 messages so the UI doesn't lag
        if (this.messages.length > 100) this.messages.shift();

      }
    });
    this.emitter.on("sendMessage", message => this.sendMessage(message));
  },
  unmounted() {
    console.log("attempting to disconnect");
    this.emitter.all.delete("sendMessage");
    socket.disconnect();
  },
  methods: {
    translation,
    loadMessagesFromCache(){
      if (!localStorage.messages) return
      let cachedMessages = JSON.parse(localStorage.messages);
      if (cachedMessages[this.$route.params.channel_uuid]){
        this.messages = JSON.parse(cachedMessages[this.$route.params.channel_uuid]);
      }
    },
    cacheMessages(messages){
      if (!localStorage.messages) localStorage.setItem('messages', JSON.stringify({}));

      let cachedMessages = JSON.parse(localStorage.messages);

      if (Object.keys(cachedMessages) == null){
        localStorage.setItem('messages', JSON.stringify({}));
        console.log("Created message cache");
      }

      cachedMessages[this.$route.params.channel_uuid] = JSON.stringify(messages);
      localStorage.messages = JSON.stringify(cachedMessages);
      console.log("Cached messages");
    },
    async getChannel(){ 

      try {
        var channel = (await axios.get(`${this.rootPath}:2087/channels/${this.$route.params.channel_uuid}`, {
          withCredentials: true,
        })).data.channel;
      } catch (error) {
        console.log(error);        
        return
      }

      channel.member_list = channel.member_list.filter(user => user.uuid != this.me.uuid);

      // Connect to that dm's socket only if we are allowed to
      socket.emit('join_channel', this.$route.params.channel_uuid);
      this.currentChannel = channel;
      this.getMessages(0);
      // this.messages.push(response.data.dm.messages)
    },
    async getMessages(offset){
      var response = await axios.get(`${this.rootPath}:2087/channels/${this.$route.params.channel_uuid}/${offset}`, {
        withCredentials: true,
      });

      // This has one of the most weird bugs where it fixes the original variable
      // Before even running it
      // Without this the variables don't get parsed, even though this does nothing to them in theory
      // CURSED AS FUCK FUNCTION 👺
      response.data.forEach((message, index, arr) => {
        if (index >= 1) {
          if (arr[index - 1].author.uuid == message.author.uuid) message.author.same_as_last = true;
        }
        message.content = this.renderHtml(message.content);
        message.attachments = message.attachments.map(attachment => this.renderHtml(attachment.html, attachment.originalurl, attachment.size));
        
        if (index == arr.length) this.last_message = message;
      });

      this.messages = response.data;
      this.cacheMessages(response.data);
      console.log(`%c Fetched ${this.messages.length} messages! 💬💬💬`, 'color: #ff00b6; font-weight: bold;');
    },
    // This is to convert epoch to the user's time
    // Gotta fix this, apparently its some weird ass timezone in europe
    convert(epoch) {
      const dt = new Date(epoch);
      const hr = dt.getHours();
      const m = "0" + dt.getMinutes();
      
      return hr + ':' + m.substr(-2)
    },
    // This function handles sending messages
    async sendMessage(message) {

      // Init a formdata and add the message json
      let formData = new FormData();

      formData.append('message', JSON.stringify(message));
      formData.append('channel', JSON.stringify({type: this.$route.path.split('/')[1], uuid: this.$route.params.channel_uuid}));

      // Add files on the formdata if theres any
      if (message.attachments) {
        message.attachments.forEach(attachment => {
          formData.append('file', attachment.file);
        });
      }

      // Send
      axios.post(`${this.rootPath}:2087/message`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }); 
    },
    // This gets the blocked users of the current user
    async getBlockedUsers(){
      const response = await axios.get(`${this.rootPath}:2087/blockedUsers`, {
        withCredentials: true,
      });

      this.blockedUsers = response.data
    },
    // takes URLS and makes them embedded HTMLs
    renderHtml(url, originalurl, filesize){
      if (url.match(/(\.png)|(\.jpg)|(\.jpeg)|(\.gif)|(\.webp)/ig)) {
        return `<a target="_blank" href="${originalurl}"><img src=${url}></a>`;
      } 
      else if (url.match(/(\.mp4)|(\.webm)|(\.mov)/ig)){
        return `<video controls> <source src=${url}> </video>`;
      }
      else if (url.match(/(\.mp3)|(\.ogg)|(\.wav)|(\.flac)|(\.aac)/ig)){
        return `<audio controls> <source src=${url}> </audio>`;
      }
      else if (url.match(/(\.rar)|(\.7z)|(\.zip)|(\.tar)/ig)){
        return `
          <img class="fileIcon" src="${require("../assets/archive.png")}")}>
            <div class="fileInfo">
              <a class="file" target="_blank" href="${url}">
                <p class="fileName"><strong>${url.split("/")[url.split("/").length - 1]}</strong></p>
              </a>
              <p class="fileSize">${filesize} bytes</p>
            </div>`;
      }
      else if (url.match(/(\.exe)/ig)){
        return `
          <img class="fileIcon" src="${require("../assets/exe.png")}")}>
            <div class="fileInfo">
              <a class="file" target="_blank" href="${url}">
                <p class="fileName"><strong>${url.split("/")[url.split("/").length - 1]}</strong></p>
              </a>
              <p class="fileSize">${filesize} bytes</p>
            </div>`;
      }
      else if (url.match(/(\.pdf)/ig)){
        return `
          <img class="fileIcon" src="${require("../assets/pdf.png")}")}>
            <div class="fileInfo">
              <a class="file" target="_blank" href="${url}">
                <p class="fileName"><strong>${url.split("/")[url.split("/").length - 1]}</strong></p>
              </a>
              <p class="fileSize">${filesize} bytes</p>
            </div>`;
      }
      else {
        // if its not an image then its probably a normal link therefore
        // ill make it clickable
        return linkifyHtml(url, {defaultProtocol: 'https'});
      }
    }
  }
}

</script>

<style scoped>

.ganyu {
  mix-blend-mode: screen;
}

.messages {
  scrollbar-color: #888888#F3F3F3;
  scrollbar-width: thin;
  flex-direction: column-reverse;
  display: flex;
  overflow: scroll;
  overflow-x: hidden;
  height: calc(100vh - 155px);
  
}

.messages:first-child {
  padding-bottom: 8px;
}

.messages.darkmode {
  scrollbar-color: var(--light)var(--dark) ;
}


.typingUsers {
  display: flex;
  margin: 0px 18px;
}

@keyframes scaleUp {
  0% {
    width: 0px;
    height: 0px;
  }
  100% {
    width: 24px;
    height: 24px;
  }
}

.DMs {
  background: var(--light);
  position: relative;
  overflow: hidden;
  width: 100%;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: flex-end;
}

.file {
  color: black;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.fileInfo {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.fileIcon {
  /* filter:invert(1); */
  width: 48px;
  cursor: inherit;
}

.fileName {
  transition: 100ms ease;
}

.fileName:hover {
  color: #ff0084;

}

.typing {
  animation-name: scaleUp;
  animation-duration: 100ms;
  animation-timing-function: ease;
  margin-right: 8px;
  width: 24px;
  height: 24px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.dummy {
  height: 64px;
  width: 100%;
}
.message {
  padding: 6px 0px;
  margin: 0px 4px 0px 16px;
  align-items: flex-start;
  display: flex;
  position: relative;
  top: 12px;
}

.message:not(.same) {
  margin-bottom: -8px;
}

.message:not(.me) .notch {
  height: 24px;
  width: 24px;
  background: var(--dark);
  position: absolute;
  top: 12px;
  left: 32px;

}
.message.me {
  flex-direction: row-reverse; }

.message.me .notch {
  height: 24px;
  width: 24px;
  background: var(--dark);
  position: absolute;

  top: 12px;
  right: 32px;
}

.message .notch.darkmode {
  background: var(--dark);
}

.message.same .notch { display: none };

.messageBubble {
  align-items: flex-end;
  flex-direction: column;
  display: flex;
  gap: 12px;
}


.message.me .messageBubble {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  border-radius: 16px 0px 16px 16px;
  gap: 12px;
}

.message.me .messageBubble .date {
  text-align: end;
  margin-left: 0px;
  margin-right: 24px;

}

.message.me .messageBubble .content{ text-align: end; }

.messageBubble .content {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 6px 0px;
  padding: 10px 12px;
  background: var(--dark);
  overflow-wrap: anywhere;
  color: var(--textLight);
  margin-bottom: 1px;
  /* max-width: 600px; */
  font-weight: 400;
  width: fit-content;
  border-radius: 0px 16px 16px 0px;
}

.message.me .messageBubble .content {
  border-radius: 16px 0px 0px 16px;
}

.messageBubble .content img { 
  cursor: pointer; 
  max-width: 512px;
  max-height: 168px;
}

.message .messageBubble .content.mention {
  border-left: 4px solid #ff0084;
  background: #ffe6f3 !important; 
  border-radius: 0px 12px 12px 0px !important;
  color: #ff0084;
}

.message .messageBubble .content.mention.darkmode { background: #3b001f !important; /* darkmode */ }
.message.me .messageBubble .content.mention{
  border-radius: 12px 0px 0px 12px !important;
  border-left: none;
  border-right: 4px solid #ff0084;
}

.messageBubble .date {
  color: #8F8F8F;
  font-size: 10px;
  font-weight: 500;
  margin-left: 24px;
  display: flex;
}

.message.same .messageBubble .date { display: none; }

.message.same .content {
  margin: -4px 4px;
  transform: translateY(-5px);
}

.message.same.me .content { margin-right: 50px; /* what the fuck why isn't this on the grid */ }

.message.same .content { margin-left: 50px; /* what the fuck why isn't this on the grid */ }

.date a {
  text-decoration: none;
  color: #8F8F8F;
  margin-right: 4px;
}

.message .pfp {
  border-radius: 100%;
  width: 39px;
  height: 39px;
  background-position: center;
  background-size: cover;
  position: relative;
  z-index: 100;
  border: var(--light) 6px solid;
  box-sizing: content-box;
}

.message.same .pfp { display: none; }

.flare {
  border-radius: 32px;
  color: var(--dark);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  padding: 0px 8px;
}

@media only screen and (min-width: 715px)  {
  .dummy { height: 8px; }
}
</style>
