<template>
  <div class="DMs" :class="{darkmode: darkmode == 'true'}" @dragover.prevent @drop.prevent="handleFileDrop" @paste="handleFilePaste">
    <div class="tag-grid">

      <div class="messages" :class="{darkmode: darkmode == 'true'}">
        <div class="message" v-for="message in messages" :key="message" v-bind:class="{me: me == message.author.username, same: message.author.sameAsLast}">
          <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('${message.author.pfp}')`}"></div></router-link>
          <div class="messageBubble">
            <h4 class="date">
              <router-link :to='`/profile/${message.author.username}`'>
                <strong>{{message.author.username}}</strong>
              </router-link> 
              <div class="flare" v-if="message.author.flare && message.author.flare.enabled" :style="{'background': message.author.flare.color}">{{message.author.flare.content}}</div>
              {{convert(message.date)}}
            </h4>
            <h2 class="content" v-if="message.content.length != 0" :class="{mention: message.content.includes('@') && (message.content.toLowerCase().includes(me.toLowerCase()) || message.content.toLowerCase().includes('everyone')), darkmode: darkmode == 'true'}" v-html="message.content"></h2>
            <h2 class="content" :class="{darkmode: darkmode == 'true'}" v-for="attachment in message.attachments" :key="attachment" v-html="attachment.html"></h2>
          </div>
        </div>

        <div class="typingUsers">
          <div v-for="pfp of typingUsers" :key="pfp" class="typing" :style="{ 'background-image': `url(${pfp})`}"></div>
        </div>
        
        <div class="dummy"></div>
      </div>

      <div class="sendMessageContainer">
        <form id="sendMessage" class="sendMessage" :class="{darkmode: darkmode == 'true'}" v-on:submit.prevent="sendMessage" >
          <input multiple id="file" class="formImageInput" type="file" ref="files" v-on:change="handleFileInput()">
          <img class="previewFile" v-for="file in previews" :src="file" :key="file" @click="deselect(previews.indexOf(file))" alt="">
          
          <div class="inputFields">
            <img class="plusButton" src="../assets/plus.svg" alt="" @click="$refs.files.click()">
            <input :class="{darkmode: darkmode == 'true'}" ref="message" type="text" name="chat" @keydown="typing()" id="chat" v-model="message" maxlength="4096" placeholder="Message" autocomplete="off">
            <div v-if="previews.length > 0" type="file" class="quickButton removeAll" @click.prevent="deselectAll()">REMOVE ALL</div>
            <button v-if="message || previews.length > 0" type="file" class="quickButton submit" form="sendMessage">SEND</button>
          </div>
        </form> 
      </div> 
    </div>
  </div>
</template>
 
<script>
import axios from 'axios';
import io from 'socket.io-client';


const URLMatcher = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm

export default {
  name: 'home',
  data: () => {
    return {
      message: "",
      messages: [],
      socket: io('ws://anihuu.moe:8880'),
      me: localStorage.username,
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
    };
  },
  mounted() {
    // Load Sounds
    if (!this.typingSoundUrl) this.typingSoundUrl = require("../../public/keystroke.wav");
    this.typingSound = new Audio(this.typingSoundUrl);
    this.typingSound.volume = 0.2;

    if (!this.mentionSoundUrl) this.mentionSoundUrl = require("../../public/notification.wav");
    this.mentionSound = new Audio(this.mentionSoundUrl);

    setTimeout(() => {
      let dummy = document.querySelector(".dummy");
      dummy.scrollIntoView({behavior: "smooth"});
    }, 500);

    let lastMessage = {
      author: {
        username: "a72bd87a2nh3hjd"
      }
    };

    this.socket.on('messages', messages => {
      lastMessage = messages[0];

      messages.forEach(message => {
        // Parse all the messages when loading the site 
        // So we group the messages by the same users together like below
        if (lastMessage.author.username == message.author.username) message.author.sameAsLast = true;
        lastMessage = message;
        this.messages.push(message);
      });
    });
    this.socket.on('message', message => {
      console.log(message);
      if (message.content !== undefined) {

        // If the last message is by the same user just add the message content itself without
        // Their username etc
        if (lastMessage.author.username == message.author.username) message.author.sameAsLast = true;
        lastMessage = message;
        this.messages.push(message);

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

        // Scroll to the bottom everytime someone sends a new message
        setTimeout(() => {
          let dummy = document.querySelector(".dummy");
          dummy.scrollIntoView({behavior: "auto"});
        }, 1);
      }

    });
    this.socket.on('typingUser', typingUser => {
      if (this.typingUsers.includes(typingUser.pfp)) return

      this.typingUsers.push(typingUser.pfp);

      setTimeout(() => {
        this.typingUsers.shift();
      }, 3000);

    });
  },
  unmounted() {
    this.socket.disconnect();
  },
  methods: {
    // This is to convert epoch to the user's time
    // Gotta fix this, apparently its some weird ass timezone in europe
    convert(epoch) {
      const dt = new Date(epoch);
      const hr = dt.getHours();
      const m = "0" + dt.getMinutes();
      
      return hr + ':' + m.substr(-2)
    },
    // This function deselects a file so users can cancel
    deselect(i){
      this.attachments.splice(i, 1);
      this.previews.splice(i, 1);
    },
    deselectAll(){
      this.attachments = [];
      this.previews = [];
    },
    // This function parses files when dragging and dropping on the DM
    handleFilePaste(event) {
      let files = event.clipboardData.items;
      if(!files) return;
      files.forEach(file => {
        var blob = file.getAsFile();
        this.attachments.push({file: blob});
        this.previews.push(URL.createObjectURL(blob));
      });
    },
    // This function parses files when dragging and dropping on the DM
    handleFileDrop(event) {
      let files = event.dataTransfer.files;
      if(!files) return;
      files.forEach(file => {
        this.attachments.push({file: file, name: file.name});
        this.previews.push(URL.createObjectURL(file));
      });
    },
    // This function parses files when adding them through the input box
    handleFileInput() {
      let files = this.$refs.files.files;
      if(!files) return;
      files.forEach(file => {
        this.attachments.push({file: file, name: file.name});
        this.previews.push(URL.createObjectURL(file));
      });
    },
    // This function handles sending messages
    async sendMessage(message) {

      let attachments = this.attachments;

      // Make a JSON out of the thing
      let json = JSON.stringify({
        content: this.message.trim(), 
        attachments: attachments,
        user: localStorage.token
      });

      // Init a formdata and add the message json
      let formData = new FormData();
      formData.append('message', json);

      // Add files on the formdata if theres any
      console.log(this.attachments);
      if (this.attachments) {
        this.attachments.forEach(attachment => {
          formData.append('file', attachment.file);
        });
      }

      // Send
      axios.post('http://anihuu.moe:8880/message', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }); 

      // Reset
      this.message = "";
      this.previews = [];
      this.attachments = [];

      // Maintain focus on keyboard for mobile
      this.$refs.message.focus();
    },
    // This is the function that triggers the typing sounds
    // It can be turned off from the settings
    typing(){

      if (this.typingSfx == 'false') return 

      // Send new message
      this.socket.emit('typing', {user: localStorage.token});
      this.typingSound = new Audio(this.typingSoundUrl);
      this.typingSound.volume = 0.2;
      this.typingSound.play();
      this.typingSound.currentTime = 0;
    }
  }
}

</script>

<style>

.messages {
  scrollbar-color: #888888#F3F3F3 ;
  scrollbar-width: thin;
}

.messages.darkmode {
  scrollbar-color: #363952#08090E ;
}

.messages::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 

}
.messages::-webkit-scrollbar-track {
  background-color: transparent; 
}
.messages::-webkit-scrollbar-thumb {
  background-color: #888888;
  border: 5px solid #F3F3F3; 
  border-radius: 16px;
}

.messages.darkmode::-webkit-scrollbar-thumb {
  background-color: #363952;
  border: 5px solid #08090E; 
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
  background: #F3F3F3;
  height: 100%;
  transform: translateY(-56px);
}

.DMs.darkmode { background: #08090E; /* darkmode */ }

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

.previewFile {
  border-radius: 8px;
  height: 64px;
  width: auto;
  margin: 8px;
  cursor: pointer;
  transition: 100ms ease;
  max-width: -moz-available;
  max-width: -webkit-fill-available;
}

.previewFile:hover { opacity: 50%; }

.sendMessageContainer {
  position: fixed;
  bottom: 64px;
  width: 100%;
  z-index: 4000;
}

.sendMessage {
  margin: 0px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.11);
}

.sendMessage .inputFields {
  display: flex;
  align-items: center;
}

.sendMessage .plusButton {
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 8px;
}

.sendMessage.darkmode { background: #020204; }

.sendMessage .inputFields .quickButton {
  outline: none;
  white-space: nowrap;
  border: none;
  background: transparent;
  font-weight: 500;
  color: #0094FF;
  cursor: pointer;
  font-size: 14px;
  margin-right: 16px;
}
.sendMessage .inputFields .quickButton.removeAll { color: #888888 !important }

.sendMessage button:hover { cursor: pointer; }

.sendMessage input[type=text] {
  outline: none;
  border: none;
  width: 100%;
  text-indent: 8px;
  background: white;
  border-radius: 24px; 
  height: 39px;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.sendMessage input[type=text].darkmode {
  color: white;  /* darkmode */
  background: #020204;
}

.sendMessage input[type=text]::placeholder { color: #888888; }
.formImageInput {
  display: none;
}
.messages {
  overflow: scroll;
  overflow-x: hidden;
  height: calc(100vh - 56px);
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
  background: #eee;
  overflow-wrap: anywhere;
  margin-bottom: 1px;
  max-width: 600px;
  font-weight: 500;
  width: fit-content;
  border-radius: 12px;
}

.messageBubble .content img { 
  cursor: pointer; 
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
  color: #08090E;
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
  .messages {
    /* margin-bottom: 112px; */
    margin-top: 56px;
    height: calc(100vh - 56px);
  }
  .DMs { transform: translateY(0px); }
}



</style>
