<template>
  <div class="DMs">
    <div class="tag-grid">

      <div class="messages">
        <div class="message" v-for="message in messages" :key="message"  v-bind:class="{me: me == message.author.username}">
          <router-link :to='`/profile/${message.author.username}`'><div class="pfp" :style="{'background-image' : `url('${message.author.pfp}')`}"></div></router-link>
          <div class="messageBubble">
            <h4 class="date"><strong>{{message.author.username}}</strong> {{convert(message.date)}}</h4>
            <h2 class="content" v-html="message.content"></h2>
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
import linkifyHtml from 'linkifyjs/html';

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
    this.socket.on('messages', messages => {
      this.messages = messages;
      messages.map(message => {
        return message["content"] = linkifyHtml(message.content, {defaultProtocol: 'https'});
      });
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
      let dummy = document.querySelector(".dummy");
      dummy.scrollIntoView();

      // Maintain focus on keyboard for mobile
      this.$refs.message.focus();
    },
  }
}

</script>

<style scoped>

.sendMessageContainer {
  position: fixed;
  bottom: 13px;
  width: 100%;
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
  font-size: 14px;
}

.sendMessage input[type=text]::placeholder {
  color: #C4C4C4;
}

.messages {
  height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
}
.dummy {
  height: 64px;
  width: 100%;
}
.message {
  padding: 6px 0px;
  margin: 0px 16px;
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
  margin: 0px 16px;
  padding: 12px 12px;
  background: #eee;
  overflow-wrap: anywhere;
  max-width: 600px;
  font-weight: 500;
  width: fit-content;
  border-radius: 24px;
}

.messageBubble .date {
  color: #8F8F8F;
  font-size: 10px;
  font-weight: 500;
  margin-left: 24px;
}

.message .pfp {
  border-radius: 100%;
  width: 39px;
  height: 39px;
  background-position: center;
  background-size: cover;
}
</style>
