<template>
  <header :style="{'background-image': `url('http://taku.moe:8880/banner/${channel.member_list[0].uuid}')`}">
    <div class="headerDetails">
      <div class="headerLeft">
        <div class="channelInfo">
          <router-link :to="`/profile/${channel.member_list[0].username}`"><img class="channelPfp" :src="`http://taku.moe:8880/pfp/${channel.member_list[0].uuid}`" alt=""></router-link>
          <div class="info">
            <div v-if="!channel.senpai">
              <h1>{{channel.member_list[0].username}}</h1>
              <div class="channelStatus">
                <div class="icon"></div>
                <p v-if="channel.member_list[0].profile.status.lastSeen" class="last_message">Last seen at {{new Date(channel.member_list[0].profile.status.lastSeen).toLocaleString()}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="headerRight">
        
      </div>
    </div>
    


  </header>
</template>
 
<script>

export default {
  props: {
    otherUserUUID: { type: String, required: true },
    channel:   { type: Object, required: true },
  },
  mounted(){
    console.log(this.channel);
  },
  methods: {
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
  /* background: #ff006b; */
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

.headerLeft, .headerRight { width: 100%; }

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

.channelPfp {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
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

</style>