<template>
  <div class="DMs" :class="{darkmode: darkmode == 'true'}" @dragover.prevent @drop.prevent="handleFileDrop" @paste="handleFilePaste">
    <div class="tag-grid">
      <div class="messages" :class="{darkmode: darkmode == 'true'}">
        <div class="message" v-for="message in messages" :key="message" v-bind:class="{me: me.uuid == message.author.uuid, same: message.author.same_as_last}">
          <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('http://taku.moe:8880/pfp/${message.author.uuid}')`}"></div></router-link>
          <div class="messageBubble">
            <h4 class="date">
              <router-link :to='`/profile/${message.author.username}`'>
                <strong>{{message.author.username}}</strong>
              </router-link> 
              <div class="flare" v-if="message.author.flare && message.author.flare.enabled" :style="{'background': message.author.flare.color}">{{message.author.flare.content}}</div>
              {{convert(message.created_at)}}
            </h4>
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
</template>
 
<script>
import axios from 'axios';
import io from 'socket.io-client';
import linkifyHtml from 'linkifyjs/html';

const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm

export default {
  name: 'home',
  data: () => {
    return {
      message: "",
      messages: [],
      socket: io('ws://taku.moe:8880'),
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
      currentChannel: '',
    };
  },
  mounted() {

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

    let lastMessage = {
      author: {
        username: "a72bd87a2nh3hjd"
      }
    };

    this.socket.on('disconnect', function() {
      console.log("[MESSAGE WS] DISCONNECTED!")
    });

    this.socket.on('message', message => {
      if (message.content !== undefined) {
        // If the last message is by the same user just add the message content itself without
        // Their username etc
        if (lastMessage.author.uuid == message.author.uuid) message.author.same_as_last = true;
      
        message.content = this.renderHtml(message.content);
        message.attachments = message.attachments.map(attachment => this.renderHtml(attachment.html, attachment.originalurl, attachment.size));
        
        lastMessage = message;
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

        this.lastMessage = message;

        // Remove this later but for now its here to only show the last 20 messages so the UI doesn't lag
        if (this.messages.length > 100) this.messages.shift();

        // // Scroll to the bottom everytime someone sends a new message
        // setTimeout(() => {
        //   let dummy = document.querySelector(".dummy");
        //   dummy.scrollIntoView({behavior: "auto"});
        // }, 1);
      }

    });

    // this.socket.on('typingUser', typingUser => {
    //   if (this.typingUsers.includes(typingUser.pfp)) return

    //   this.typingUsers.push(typingUser.pfp);

    //   setTimeout(() => {
    //     this.typingUsers.shift();
    //   }, 3000);

    // });
    this.emitter.on("sendMessage", message => this.sendMessage(message));
  },
  unmounted() {
    console.log("attempting to disconnect");
    this.emitter.all.delete("sendMessage");
    this.socket.emit('leave_channel', this.currentChannel);
    this.socket.disconnect();
  },
  destroyed() {
    //console.log("attempting to disconnect");
    //this.socket.disconnect();
  },
  methods: {
    async getChannel(){ 

      try {
        await axios.get(`http://taku.moe:8880/dm/${this.$route.params.channel_uuid}`, {
          withCredentials: true,
        });
      } catch (error) {
        console.log(error);        
        return
      }
      
      // Connect to that dm's socket only if we are allowed to
      this.socket.emit('join_channel', this.$route.params.channel_uuid);
      this.currentChannel = this.$route.params.channel_uuid;
      this.getMessages(0);
      // this.messages.push(response.data.dm.messages)

    },
    async getMessages(offset){
      var response = await axios.get(`http://taku.moe:8880/messages/${this.$route.params.channel_uuid}/${offset}`, {
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
        
        if (index == arr.length) this.lastMessage = message;
      });

      this.messages = response.data;

      console.log(`%c Fetched ${this.messages.length} messages! 💬💬💬`, 'color: #ff00b6; font-weight: bold;');
      console.dir(this.messages);
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
      axios.post('http://taku.moe:8880/message', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }); 
    },
    // This gets the blocked users of the current user
    async getBlockedUsers(){
      const response = await axios.get('http://taku.moe:8880/blockedUsers', {
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

<style>

.ganyu {
  mix-blend-mode: screen;
}

.messages {
  scrollbar-color: #888888#F3F3F3;
  scrollbar-width: thin;
  flex-direction: column-reverse;
  display: flex;
}

.messages.darkmode {
  scrollbar-color: var(--darkmodeLight)var(--darkmodeDark) ;
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
  background: #fff;
  height: 100%;
  transform: translateY(-56px);
  overflow: hidden;
  margin-top: 76px;
  border-radius: 32px;
}

.DMs.darkmode { background: var(--darkmodeDark); /* darkmode */ }

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

.messages {
  overflow: scroll;
  overflow-x: hidden;
  height: calc(100vh - (76px * 2) + 20px);
}
.dummy {
  height: 64px;
  width: 100%;
}
.message {
  padding: 6px 0px;
  margin: 0px 4px 0px 16px;
  align-items: flex-end;
  display: flex;
  align-items: top;
}

.message:first-child {
  margin-bottom: 14px;
}

.message.me {
  flex-direction: row-reverse; }

.message.me .messageBubble {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
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
  margin: 6px 12px;
  padding: 10px 12px;
  background: #F1F2F4;
  overflow-wrap: anywhere;
  color: #2C394A;
  margin-bottom: 1px;
  /* max-width: 600px; */
  font-weight: 400;
  width: fit-content;
  border-radius: 12px;
}

.messageBubble .content img { 
  cursor: pointer; 
  max-width: 512px;
  max-height: 168px;
}

.messageBubble .content.darkmode {
  background: #141520; /* darkmode */
  color: white; /* darkmode */
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
  margin: -4px 12px;
  transform: translateY(-5px);
}

.message.same.me .content { margin-right: 50.8px; /* what the fuck why isn't this on the grid */ }

.message.same .content { margin-left: 50.8px; /* what the fuck why isn't this on the grid */ }

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
}

.message.same .pfp { display: none; }

.flare {
  border-radius: 32px;
  color: var(--darkmodeDark);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  padding: 0px 8px;
}

@media only screen and (min-width: 715px)  {
  .sendMessageContainer { bottom: 8px; }
  .dummy { height: 8px; }
  .DMs { transform: translateY(0px); }
}

@media only screen and (max-width: 715px)  {
  .DMs { transform: translateY(0px); }
}



</style>
a