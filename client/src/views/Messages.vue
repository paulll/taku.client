<template>
  <div class="card" :class="{darkmode: darkmode == 'true'}">
    <div class="channels">
      <div class="channel" v-for="channel in channels" :key="channel">
        <router-link :to="`/profile/${channel.memberList[0].username}`"><img class="pfp" :src="`http://taku.moe:8880/pfp/${channel.memberList[0].uuid}`" alt=""></router-link>
        <div class="info">
          <div v-if="!channel.king">
            <router-link :to="`/dm/${channel.uuid}`"><h1>{{channel.memberList[0].username}}</h1></router-link>
          </div>
          <div v-if="channel.king">
            <router-link :to="`/group/${channel.uuid}`"><h1>{{channel.uuid}}</h1></router-link>
          </div>  
          <div class="status">
            <div class="icon"></div>
            <div class="lastMessage">{{channel.lastMessage.content}}</div>
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
      socket: io('ws://taku.moe:8880'),
      channels: [],
    };
  },
  mounted() {
    this.getChannels();
  },
  methods: {
    // Return list of channels this user is in
    async getChannels(){
      try {
          const response = await axios.get(`http://taku.moe:8880/channels`, {
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

.card.darkmode{
  background: #676E78;
}.channels {
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

.info a {
  width: fit-content;
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