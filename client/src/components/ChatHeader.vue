<template>
  <header :style="{'background-image': `url('https://taku.moe:2087/banner/${channel.member_list[0].uuid}')`}">
    <div class="headerDetails">
      <div class="headerLeft">
        <div class="channelInfo">
          <router-link  v-if="channel.type == 'dm'" :to="`/profile/${channel.member_list[0].username}`"><img class="channelPfp" :src="`https://taku.moe:2087/pfp/${channel.member_list[0].uuid}`" alt=""></router-link>
          <a v-if="channel.type == 'group'"><img class="channelPfp" :src="`https://taku.moe:2087/pfp/_default`" alt=""></a>
          <div class="info">
            <div v-if="!channel.senpai">
              <h1>{{channel.member_list[0].username}}</h1>
              <div class="channelStatus" v-if="channel.member_list[0].profile">
                <Status :profile="channel.member_list[0].profile" :showText="true" :showFullText="true"/>
                <!-- <p class="last_message">{{translation('last seen at')}} {{new Date(channel.member_list[0].profile.status.lastSeen).toLocaleString()}}</p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="headerRight">


        <div class="button" :class="{active: isSearching}">
          <input v-if="isSearching" ref="search" class="searchBox" spellcheck="false" placeholder="Search" v-model="searchString" type="text" @keyup="filterSearch()">
          <div class="iconContainer" @click="isSearching = !isSearching">
            <img src="../assets/search.svg" alt="Search">
          </div>
        </div>

        <div class="button" v-if="channel.type == 'group'">
          <div class="iconContainer">
            <img src="../assets/add-user.png" alt="Add User">
          </div>
        </div>

        <div class="button" @click="emitter.emit('call', channel.member_list)">
          <div class="iconContainer">
            <img src="../assets/call.png" alt="Call">
          </div>
        </div>

        <div class="button">
          <div class="iconContainer">
            <img src="../assets/settings.svg" alt="Search">
          </div>
        </div>

        <div class="meInfo">
          <router-link :to="`/profile/${me.username}`"><img class="channelPfp" :src="`https://taku.moe:2087/pfp/${me.uuid}`" alt=""></router-link>
        </div>
      </div>
    </div>
    


  </header>
</template>
 
<script>
import translation from '@/services/translator.js';
import Status from '@/components/v2/Status.vue'

export default {
  data: () => {
    return {
          me: JSON.parse(localStorage.me),
          isSearching: false,
    };
  },
  props: {
    channel:   { type: Object, required: true },
  },
  components: {
    Status,
  },
  methods: {
    translation,
    convert(epoch) {
      const dt = new Date(epoch);
      const hr = dt.getHours();
      const m = "0" + dt.getMinutes();
      
      return hr + ':' + m.substr(-2)
    }
  }
}

</script>

<style scoped>
header {
  height: 80px;
  width: 100%;
  background-color: var(--darker);
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  z-index: 101;
}

header img {
  width: 100%;
  object-fit: cover;
}

.headerLeft { 
  width: 100%; 
}

.headerRight { 
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.headerRight .iconContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.headerRight .iconContainer img {
  width: 32px;
  height: 32px;
  filter: invert(1);
}

.meInfo {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  border-left: 0px solid #ff006b;
  overflow: hidden;
}

.channelPfp {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    -o-object-fit: cover;
    object-fit: cover;
}

.headerDetails {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channelInfo {
  width: 100%;
  display: flex;
  padding: 8px 16px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  border-right: 0px solid #ff006b;
  overflow: hidden;
}


.channel {
  width: 100%;
  display: flex;
  padding: 8px 16px;
  text-decoration: none;
  transition: 100ms ease-out;
  outline: none;
  border-right: 0px solid #ff006b;
  overflow: hidden;
}

.channel a {
  width: 48px;
  height: 48px
}

.info {
  padding: 4px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  margin-left: 16px;
  width: 60%;
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

  color: #ffffff;
}

.channelStatus {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}

.channelStatus .icon {
  position: static;
  width: 20px;
  min-width: 20px;
  height: 10px;

  border: 3px solid #7FE876;
  box-sizing: border-box;
  border-radius: 56px;
}

.channelStatus .last_message {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  color: #F1F2F4;
  margin: 0px 4px;
}

.searchBox {
  outline: none;
  border: none;
  text-indent: 8px;
  height: 44px;
  width: 100%;
  background: transparent;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.searchBox::placeholder { 
  color: #81859D; 
}

.button {
  cursor: pointer;
  width: fit-content;
  min-width: 48px;
  height: 48px;
  width: 48px;

  position: relative;

  display: flex;
  align-items: center;
  border-radius: 12px;
  transition: 200ms ease-out;
}

.button.active {
  width: 100%;
}

.button:hover, .button.active {
  background: #F1F2F4;
  transition: 100ms ease-in;
}

.button .iconContainer {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
}

</style>