<template>
  <div class="channel" v-if="channel.member_list[0]" @click="cachedChannels.push(channel.uuid)">
    <MiniProfile v-if="isShowingMiniProfile" :posX="MiniProfilePosX" :posY="MiniProfilePosY" :profile="channel.member_list[0].profile" :uuid="channel.member_list[0].uuid" :username="channel.member_list[0].username"/>
    <router-link :to="`/messages/${channel.type}/${channel.uuid}`" class="channelContent">
      <router-link :to="`/profile/${channel.member_list[0].username}`" @mouseenter="showMiniProfile($event)" @mouseleave="mouseLeftHover()" ><img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link>
      <div class="info">
      <div> 
        <h1 v-if="channel.type == 'dm'">{{channel.member_list[0].username}}</h1>
        <h1 v-if="channel.type == 'group'">{{channel.name}}</h1>
        <div class="channelStatus">
          <Status :profile="channel.member_list[0]?.profile"/>
          <p v-if="channel.last_message" class="last_message">{{channel.last_message.content}}</p>
        </div>
      </div>
      </div>
      <!-- <p class="cacheStatus" v-if="cachedChannels.includes(channel.uuid)">CACHED</p> -->
      <menu @click="isShowingDropMenu = true">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <DropMenu v-if="isShowingDropMenu" :channel="channel" @mouseleave="isShowingDropMenu = false"/>
      </menu>
    </router-link>
  </div>
</template>

<script>
import Status from '@/components/v2/Status.vue'
import MiniProfile from '@/components/v2/MiniProfile.vue'; 
import DropMenu from '@/components/v2/DropMenu.vue'; 

export default {
  computed: {
    cachedChannels: () => {
      if(localStorage.messages){
        return Object.keys(JSON.parse(localStorage.messages))
      } else {
        return [];
      }
    },
  },
  data: () => { 
    return {
      isShowingDropMenu: false,
      isShowingMiniProfile: false,
      isHoveringOver: false,
      MiniProfilePosX: 0,
      MiniProfilePosY: 0,
    }
  },
  props: {
    channel:{ type: Object, required: true },
  },
  components: {
    MiniProfile,
    Status,
    DropMenu,
  },
  methods: {
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms)), 
    async showMiniProfile(e){
      this.isHoveringOver = true;
      await this.sleep(500);
      if (!this.isShowingMiniProfile) this.MiniProfilePosX = e.clientX;
      if (!this.isShowingMiniProfile) this.MiniProfilePosY = e.clientY;
      if(this.isHoveringOver) this.isShowingMiniProfile = true;
    },
    async mouseLeftHover() {
      this.isHoveringOver = false;
      await this.sleep(350);
      if(!this.isHoveringOver) this.isShowingMiniProfile = false;
    }
  }
}
</script>

<style scoped>

.channel {
  /* position: relative; */
}

.channelContent {
  width: 100%;
  display: flex;
  padding: 8px 16px 8px 8px;
  color: var(--textLight);
  border-radius: 4px;
  border: transparent 1px solid;
  height: 48px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  align-items: center;
}

.channelContent.router-link-active {
  background: var(--light);
}

.channelContent:hover { 
  border: var(--hoverOutline) 1px solid;
}

.channelContent a {
  width: 32px;
  height: 32px;
}

.channelContent menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  justify-content: center;
  gap: 2px;
  width: 32px;  
  height: 32px;
}

.channelContent menu .dot {
  width: 4px;
  height: 4px;
  border-radius: 4px;
  background: var(--hoverOutline);
}

.channelPfp {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  object-fit: cover;
}

.info {
  padding: 4px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  margin-left: 8px;
  width: 100%;
}

.info a {
  width: fit-content;
  text-decoration: none;
}

.info a, h1{
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 117.9%;
  /* identical to box height, or 17px */

  text-decoration: none;
  display: flex;
  align-items: center;
  text-align: left;
}

.channelStatus {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  margin-top: 4px;
  color: var(--textDark);
}

.channelStatus .last_message {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px 4px;
  max-width: 160px;
}

.cacheStatus {
  color: #7FE876;
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 117.9%;
}

</style>