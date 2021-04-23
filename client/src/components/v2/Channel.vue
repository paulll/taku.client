<template>
  <div v-if="channel.member_list[0]" @click="cachedChannels.push(channel.uuid)">
    <router-link :to="`/messages/${channel.type}/${channel.uuid}`" class="channel">
      <router-link :to="`/profile/${channel.member_list[0].username}`"><img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link>
      <div class="info">
      <div> 
        <h1 v-if="channel.type == 'dm'">{{channel.member_list[0].username}}</h1>
        <h1 v-if="channel.type == 'group'">{{channel.name}}</h1>
        <div class="channelStatus">
        <div class="icon" :class="{
          online: parseInt(channel.member_list[0].profile.status.lastSeen) > new Date().getTime() - 300000,
          offline: parseInt(channel.member_list[0].profile.status.lastSeen) <= new Date().getTime() - 300000,
          }"></div>
        <p v-if="channel.last_message" class="last_message">{{channel.last_message.content}}</p>
        </div>
      </div>
      </div>
      <p class="cacheStatus" v-if="cachedChannels.includes(channel.uuid)">CACHED</p>
      <!-- <menu>
        <div></div>
        <div></div>
        <div></div>
      </menu> -->
    </router-link>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      cachedChannels: Object.keys(JSON.parse(localStorage.messages)) || [],
    }
  },
  props: {
    channel:{ type: Object, required: true },
  },
}
</script>

<style scoped>
.channel {
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
  overflow: hidden;
  align-items: center;
}

.channel.router-link-active {
  background: var(--light);
}

.channel:hover { 
  border: var(--hoverOutline) 1px solid;
}

.channel a {
  width: 32px;
  height: 32px;
}

.channel menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 32px;  
  height: 32px;
}

.channel menu * {
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

.channelStatus .icon {
  position: static;
  width: 16px;
  min-width: 18px;
  height: 10px;

  border: transparent 3px solid;
  box-sizing: border-box;
  border-radius: 56px;
}

.offline {
  border: #626262 3px solid !important;
}

.online {
  border: #7FE876 3px solid !important;
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