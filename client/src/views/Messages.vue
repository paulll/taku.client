<template>
  <div class="card">
    <div class="channels">
      <div class="channel" v-for="channel in channels" :key="channel">
        <img class="pfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt="">
        <div class="info">
          <div v-if="!channel.king">
            <router-link :to="`/dm/${channel.uuid}`"><h1>{{channel.memberList[0].username}}</h1></router-link>
          </div>
          <div v-if="channel.king">
            <router-link :to="`/group/${channel.uuid}`"><h1>{{channel.uuid}}</h1></router-link>
          </div>  
          <div class="status">
            <div class="icon"></div>
            <div class="lastMessage">{{channel.lastMessage?.content}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import axios from 'axios';
import io from 'socket.io-client';
import linkifyHtml from 'linkifyjs/html';

export default {
  name: 'home',
  data: () => {
    return {
      me: JSON.parse(localStorage.me),
      dms: [],
      channels: [],
    };
  },
  mounted() {
    this.getChannels();
  },
  methods: {
    // Return list of channels this user is in
    async getChannels(){
      const response = await axios.get(`http://taku.moe:8880/channels`, {
        withCredentials: true,
      });

      let channels = [];
      for (let channel of response.data.channels){
        let memberList = [];

        for (let member of channel.memberList){
          if (member.uuid != this.me.uuid) memberList.push(member);
        }
        
        channel.memberList = memberList;
        channels.push(channel);
      }

      response.data.channels = channels;

      this.channels = response.data.channels;
    }
  }
}

</script>

<style>

.card {
  margin-top: 76px;
  border-radius: 32px;
  background: white;
  height: 100%;
}

.channels {
  padding: 16px;
  display: grid;
  gap: 16px;
}

.channel {
  width: 100%;
  display: flex;
}

.pfp {
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
}

.info a, h1{
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 117.9%;
  /* identical to box height, or 17px */

  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: left;

  color: #2C394A;
}

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.status .icon {
  position: static;
  width: 20px;
  height: 10px;

  border: 3px solid #7FE876;
  box-sizing: border-box;
  border-radius: 56px;
}

.status .lastMessage {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #81859D;
  margin: 0px 4px;
}

</style>


 <!-- <div class="userListContainer">
      <div class="userListHeader"></div>
      <div class="userList">
        <div class="dm" v-for="user in dms" :key="user">
          <img :src="`http://taku.moe:8880/user/${user}/pfp`" alt="">
          {{user}}
        </div>
      </div>
    </div> -->
    <!-- <div class="tag-grid">

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
            <div class="content" :class="{darkmode: darkmode == 'true'}" v-for="attachment in message.attachments" :key="attachment" v-html="attachment"></div>
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
          <div class="images" :class="{darkmode: darkmode == 'true'}">
            <img class="previewFile" v-for="file in previews" :src="file" :key="file" @click="deselect(previews.indexOf(file))" alt="">
          </div>
          <div class="inputFields">
            <img class="plusButton" src="../assets/plus.svg" alt="" @click="$refs.files.click()">
            <input :class="{darkmode: darkmode == 'true'}" ref="message" type="text" name="chat" @keydown="typing()" id="chat" v-model="message" maxlength="4096" placeholder="Message" autocomplete="off">
            <div v-if="previews.length > 0" type="file" class="quickButton removeAll" @click.prevent="deselectAll()">REMOVE ALL</div>
            <button v-if="message || previews.length > 0" type="file" class="quickButton submit" form="sendMessage">SEND</button>
          </div>
        </form> 
      </div> 
    </div> -->