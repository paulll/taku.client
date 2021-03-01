<template>
  <div class="channelsContainer" :class="{darkmode: darkmode == 'true'}">
    <div class="search">
      <h1>Chats</h1>
      <img src="../assets/search.svg" alt="">
    </div>
    <menu>
      <div @click="view = 'private'" :class="{'active': view == 'private'}">
        PRIVATE
      </div>
      <div @click="view = 'group'" :class="{'active': view == 'group'}">
        GROUPS
      </div>
    </menu>
    <section>
      <h1 v-if="privateChannels.length != 0 && view == 'private'">USERS</h1>
      <h1 v-if="groupChannels.length != 0 && view == 'group'">GROUPS</h1>
    </section>

    <div class="emptyMessage" v-if="privateChannels.length == 0 && view == 'private'">  
      <h1 class="message">You don't have any dms!</h1>
      <h1 class="emoji">(｡•́︿•̀｡)</h1>
    </div>

    <div class="emptyMessage" v-if="groupChannels.length == 0 && view == 'group'">  
      <h1 class="message">You don't have any group chats!</h1>
      <h1 class="emoji">(｡•́︿•̀｡)</h1>
    </div>

    <div class="channels">
      <router-link :to="`/messages/private/${channel.uuid}`" v-if="view == 'private'" class="channel" v-for="channel in privateChannels" :key="channel">
        <router-link :to="`/profile/${channel.memberList[0].username}`"><img class="pfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt=""></router-link>
        <div class="info">
          <div v-if="!channel.king">
            <h1>{{channel.memberList[0].username}}</h1>
            <div class="status">
              <div class="icon"></div>
              <div v-if="channel.lastMessage" class="lastMessage">{{channel.lastMessage.content}}</div>
            </div>
          </div>
        </div>
      </router-link>

      <div class="channel" v-for="channel in groupChannels" v-if="view == 'group'" :key="channel">
        <!-- <router-link v-if="!channel.king" :to="`/profile/${channel.memberList[0].username}`"><img class="pfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt=""></router-link> -->
        <div class="info">
          <div v-if="channel.king">
            <router-link :to="`/group/${channel.uuid}`"><h1>{{channel.uuid}}</h1></router-link>
            <div class="status">
              <div class="icon"></div>
              <div v-if="channel.lastMessage" class="lastMessage">{{channel.lastMessage.content}}</div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  </div>
  <Chat/>
</template>
 
<script>
import axios from 'axios';
import io from 'socket.io-client';
import linkifyHtml from 'linkifyjs/html';

import Chat from '@/components/Chat.vue';

export default {
  name: 'home',
  components: {
    Chat,
  },
  data: () => {
    return {
      me: JSON.parse(localStorage.me),
      dms: [],
      socket: io('ws://taku.moe:8880'),
      channels: [],
      privateChannels: [],
      groupChannels: [],
      view: 'private',
    };
  },
  mounted() {
    this.getChannels();
  },
  methods: {
    // Return list of channels this user is in
    async getChannels(){
      try {
          var response = await axios.get(`http://taku.moe:8880/channels`, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.status = 401) {
          localStorage.clear();
          window.location.href = "http://taku.moe:8080/login";
          return
        }
      }

      let channels = [];
      for (let channel of response.data.channels){
        let memberList = [];

        for (let member of channel.memberList){
          if (member.uuid != this.me.uuid) memberList.push(member);
        }
        
        channel.memberList = memberList;

        if (channel.memberList.length == 1) this.privateChannels.push(channel);
        if (channel.memberList.length >= 2) this.groupChannels.push(channel);
      }

      response.data.channels = channels;

      this.channels = response.data.channels;
    }
  }
}

</script>

<style>

.channelsContainer {
  background: white;
  width: 320px;
  min-width: 320px;
  border-right: #F1F2F4 2px solid;
}

.channelsContainer.darkmode{
  background: #676E78;
  height: 100%;
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
  width: 32px;
  height: 32px;
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
  cursor: pointer;
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
}

.channel a {
  width: 48px;
  height: 48px
}

.channel:hover {
  background: #FFF0F6;
}

.channel.router-link-active {
  border-right: 4px solid #ff006b;
  background: linear-gradient(270deg, #FFBFDE 0%, rgba(255, 234, 241, 0) 100%);
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
  text-decoration: none;
  margin-left: 16px;
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

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
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
  font-size: 10px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #81859D;
  margin: 0px 4px;
}

</style>