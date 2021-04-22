<template>
    <div class="user">
        <div class="container">
            <router-link :to="`/profile/${user.username}`"><img class="pfp" :src="`${rootPath}:2087/pfp/${user.uuid}`" alt=""></router-link>
            <div class="info">
                <h1>{{user.username}}</h1>
                <div class="userStatus">
                    <div class="icon"></div>
                    <p v-if="user.profile.status.lastSeen" class="status">{{translation('last seen at')}}  {{new Date(user.profile.status.lastSeen).toLocaleString()}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import translation from '@/services/translator.js';

export default {
  name: 'MiniUser',
  props: {
    user: { type: Object, required: true },
  },
  methods: {
    translation
  }
}
</script>
<style scoped>
.pfp {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    object-fit: cover;
}

.user {
    width: 100%;
    display: flex;
    text-decoration: none;
    transition: 100ms ease-out;
    outline: none;
    border-right: 0px solid #ff006b;
    overflow: hidden;
    align-items: flex-start;
}

.user a {
    width: 48px;
    height: 48px
}

.userStatus {
    display: flex;
    align-items: center;
}

.info {
  padding: 4px 0px;
  display: grid;
  gap: 8px;
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

  color: #2C394A;
}

.container {
    display: flex;
    align-items: center;
}

.status {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    margin-top: 8px;

    font-family: Work Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 10px;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    color: #2C394A;
    margin: 0px 4px;
}

.icon {
    position: static;
    width: 20px;
    min-width: 20px;
    height: 10px;

    border: 3px solid #7FE876;
    box-sizing: border-box;
    border-radius: 56px;
}


</style>