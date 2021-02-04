<template>
  <div class="DMs">
    <div class="tag-grid">

      <div class="messages">
        <div class="message" v-for="message in messages" :key="message" v-bind:class="{me: me == message.author.username}">
          <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('${message.author.pfp}')`}"></div></router-link>
          <div class="messageBubble">
            <h4 class="date">
              <router-link :to='`/profile/${message.author.username}`'>
                <strong>{{message.author.username}}</strong></router-link> {{convert(message.date)}}
            </h4>
            <h2 class="content" :class="{mention: message.content.startsWith('@') && message.content.includes(me)}" v-html="message.content"></h2>
          </div>
        </div>
        <div class="dummy"></div>
      </div>

      <div class="sendMessageContainer">
        <form class="sendMessage" v-on:submit.prevent="sendMessage">
          <input ref="message" type="text" name="chat" id="chat" v-model="message" placeholder="Message" autocomplete="off">
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
    };
  },
  mounted() {
    var notificationSound = new Audio(require('../../public/notification.mp3'));

    setTimeout(() => {
      let dummy = document.querySelector(".dummy");
      dummy.scrollIntoView({behavior: "smooth"});
    }, 500);

    this.socket.on('messages', messages => {
      console.log(messages);
        this.messages.push(...messages);
    });
    this.socket.on('message', message => {
      console.log(message);
      if (message.content !== undefined) {

        // add the message to the total messages
        this.messages.push(message);

        // Play notification sound if they are alt tabbed
        window.navigator.vibrate(100);
        if (!document.hasFocus()) {
          notificationSound.play();
          console.log("playing sound");
        }   

        // Remove this later but for now its here to only show the last 20 messages so the UI doesn't lag
        if (this.messages.length > 50) this.messages.shift();

        // Scroll to the bottom everytime someone sends a new message
        setTimeout(() => {
          let dummy = document.querySelector(".dummy");
          dummy.scrollIntoView({behavior: "auto"});
        }, 1);

      }
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
    sendMessage(message) {
      // Send new message
      this.socket.emit('message', {content: this.message.trim(), user: localStorage.token});
      this.message = "";

      // Scroll to last message
      // let dummy = document.querySelector(".dummy");
      // dummy.scrollIntoView({behavior: "smooth"});

      // Maintain focus on keyboard for mobile
      this.$refs.message.focus();
    },
  }
}

</script>

<style>

.sendMessageContainer {
  position: fixed;
  bottom: 64px;
  width: 100%;
  z-index: 4000;
}

.sendMessage {
  margin: 0px 12px;
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
  margin: 0px 12px;
  padding: 10px 12px;
  background: #eee;
  overflow-wrap: anywhere;
  margin-bottom: 1px;
  max-width: 600px;
  font-weight: 500;
  width: fit-content;
  border-radius: 12px;
}

.mention {
  border-left: 4px solid #ff0084;
  background: #ffe6f3 !important;
  border-radius: 0px 12px 12px 0px !important;
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
