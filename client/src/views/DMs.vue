<template>
  <div class="DMs" @dragover.prevent @drop.prevent="handleFileDrop">
    <div class="tag-grid">

      <div class="messages">
        <div class="message" v-for="message in messages" :key="message" v-bind:class="{me: me == message.author.username}">
          <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('${message.author.pfp}')`}"></div></router-link>
          <div class="messageBubble">
            <h4 class="date">
              <router-link :to='`/profile/${message.author.username}`'>
                <strong>{{message.author.username}}</strong>
              </router-link> {{convert(message.date)}}
            </h4>
            <h2 class="content" v-if="message.content.length != 0" :class="{mention: message.content.includes('@') && message.content.toLowerCase().includes(me.toLowerCase())}" v-html="message.content"></h2>
            <h2 class="content" v-for="attachment in message.attachments" :key="attachment" v-html="attachment"></h2>
          </div>
        </div>
        <div class="dummy"></div>

        <div class="typingUsers">
          <div v-for="pfp of typingUsers" :key="pfp" class="typing" :style="{ 'background-image': `url(${pfp})`}"></div>
        </div>
        
      </div>

      <div class="sendMessageContainer">
        <form class="sendMessage" v-on:submit.prevent="sendMessage">
          <!-- <input id="file" class="formImageInput" type="file" ref="file" v-on:change="handleFileInput()"> -->
          <img class="previewFile" v-for="file in previews" :src="file" :key="file" alt="">
          <input ref="message" type="text" name="chat" @keydown="typing()" id="chat" v-model="message" placeholder="Message" autocomplete="off">
          <button v-if="message" type="submit">SEND</button>
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
    };
  },
  mounted() {
    setTimeout(() => {
      let dummy = document.querySelector(".dummy");
      dummy.scrollIntoView({behavior: "smooth"});
    }, 500);

    this.socket.on('messages', messages => {
        this.messages.push(...messages);
    });
    this.socket.on('message', message => {
      if (message.content !== undefined) {

        console.log(message);

        // add the message to the total messages
        this.messages.push(message);

        // Play notification sound if they got mentioned
        if (message.content.includes('@') && message.content.toLowerCase().includes(this.me.toLowerCase())) {
          window.navigator.vibrate(100);
          var notificationSound = new Audio("https://cdn.discordapp.com/attachments/755597803102928966/806690267784151060/notification.mp3");
          notificationSound.play();
          console.log("playing sound");
        };

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
    convert(epoch) {
      const dt = new Date(epoch);
      const hr = dt.getUTCHours();
      const m = "0" + dt.getUTCMinutes();
      
      return hr + ':' + m.substr(-2)
    },
    handleFileDrop(event) {
      let droppedFiles = event.dataTransfer.files;
      if(!droppedFiles) return;
      droppedFiles.forEach(file => {
        this.attachments.push({file: file, name: file.name});
        this.previews.push(URL.createObjectURL(file));
      });

      console.log(this.attachments);

    },
    sendMessage(message) {

      // Send new message
      this.socket.emit('message', {content: this.message.trim(), attachments: this.attachments, user: localStorage.token});

      // Reset
      this.message = "";
      this.previews = [];
      this.attachments = [];

      // Scroll to last message
      // let dummy = document.querySelector(".dummy");
      // dummy.scrollIntoView({behavior: "smooth"});

      // Maintain focus on keyboard for mobile
      this.$refs.message.focus();
    },
    typing(){
      // Send new message
      this.socket.emit('typing', {user: localStorage.token});

      var typingSound = new Audio(require("../../public/keystroke.wav"));
      typingSound.volume = 0.2;
      typingSound.play();

    }
  }
}

</script>

<style>

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
}

.sendMessageContainer {
  position: fixed;
  bottom: 64px;
  width: 100%;
  z-index: 4000;
}

.sendMessage {
  margin: 0px 12px;
  background: #020204;
  border-radius: 16px;
}

.sendMessage button {
  outline: none;
  border: none;
  background: transparent;
  font-weight: 500;
  color: #0094FF;
  position: absolute;
  transform: translate(-55px, 11px);
}

.sendMessage button:hover {
  cursor: pointer;
}

.sendMessage input[type=text] {
  outline: none;
  border: none;
  width: 100%;
  text-indent: 12px;
  background: white;
  background: #020204; /* darkmode */
  color: white;  /* darkmode */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.11);
  border-radius: 24px; 
  height: 39px;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.sendMessage input[type=text]::placeholder {
  color: #C4C4C4;
}

.messages {
  margin-top: 56px;
  margin-bottom: 56px;
  height: calc(100vh - 112px);
  overflow: scroll;
  overflow-x: hidden;
}
.dummy {
  height: 2px;
  width: 100%;
}
.message {
  padding: 6px 0px;
  margin: 0px 16px;
  align-items: flex-end;
  display: flex;
  align-items: top;
}

.message.me {
  flex-direction: row-reverse;
}

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

.message.me .messageBubble .content{
  text-align: end;
  
}

.messageBubble .content {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 6px 12px;
  padding: 10px 12px;
  background: #eee;
  background: #141520; /* darkmode */
  color: white; /* darkmode */
  overflow-wrap: anywhere;
  margin-bottom: 1px;
  max-width: 600px;
  font-weight: 500;
  width: fit-content;
  border-radius: 12px;
}

.message .messageBubble .content.mention {
  border-left: 4px solid #ff0084;
  background: #ffe6f3 !important; 
  background: #3b001f !important; /* darkmode */
  border-radius: 0px 12px 12px 0px !important;
  color: #ff0084;
}

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
}

.date a {
  text-decoration: none;
  color: #8F8F8F;
}

.message .pfp {
  border-radius: 100%;
  width: 39px;
  height: 39px;
  background-position: center;
  background-size: cover;
}

@media only screen and (min-width: 715px)  {
  .sendMessageContainer {
    bottom: 8px;
  }
}

@media only screen and (max-width: 715px)  {
  .messages {
    margin-bottom: 112px;
    height: calc(100vh - 168px);
  }
}



</style>
