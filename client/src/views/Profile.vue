<template>
    <div v-if="user" class="userProfile" :class="{darkmode: darkmode == 'true'}">
        <div class="bannerContainer">
            <div class="gradient">
                <input type="file" ref="banner" style="display: none" accept="image/*" @change="uploadFile('banner')">
                <img @click="$refs.banner.click()" v-if="edit" src="../assets/edit.svg" alt="Edit">
            </div>
            <div class="banner" :style="{'background-image' : `url('${user.profile.banner}')`}">
            </div>
            <div class="heading" :class="{darkmode: darkmode == 'true'}">
                <div class="pfp">
                    <div v-if="user.username" class="image" :style="{'background-image': `url('${user.profile.pfp}')`}">
                        <input type="file" ref="pfp" style="display: none" accept="image/*" @change="uploadFile('pfp')">
                        <img @click="$refs.pfp.click()" v-if="edit" src="../assets/edit.svg" alt="Edit">
                    </div>
                    <svg v-if="user.profile?.isDeveloper" class="badge" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.9644 26C11.1836 26 9.50959 25.6676 7.94247 25.0027C6.37534 24.3142 4.99817 23.3763 3.81096 22.189C2.62374 20.9781 1.68584 19.589 0.99726 18.0219C0.33242 16.4548 0 14.769 0 12.9644C0 11.1361 0.33242 9.43836 0.99726 7.87123C1.68584 6.28037 2.62374 4.9032 3.81096 3.73973C4.99817 2.55251 6.37534 1.63836 7.94247 0.99726C9.50959 0.33242 11.1836 0 12.9644 0C14.7927 0 16.4904 0.344293 18.0575 1.03288C19.6484 1.69772 21.0374 2.63562 22.2247 3.84658C23.4119 5.03379 24.3379 6.41096 25.0027 7.97808C25.6676 9.52146 26 11.1836 26 12.9644C26 14.769 25.6557 16.4548 24.9671 18.0219C24.3023 19.589 23.3763 20.9781 22.189 22.189C21.0018 23.3763 19.6128 24.3142 18.0219 25.0027C16.4548 25.6676 14.769 26 12.9644 26ZM6.91151 19.5383C6.601 20.4617 7.65966 21.2388 8.44753 20.6658L12.3792 17.8064C12.7284 17.5525 13.2012 17.5513 13.5516 17.8036L17.5645 20.6929C18.3531 21.2607 19.4064 20.4837 19.0967 19.5626L17.6237 15.1825C17.4802 14.7559 17.6394 14.286 18.0127 14.0345L21.2199 11.8731C22.0382 11.3216 21.6478 10.0438 20.661 10.0438H16.6038C16.1743 10.0438 15.7928 9.76954 15.6559 9.36239L13.924 4.20888C13.6175 3.29675 12.3257 3.30152 12.0259 4.21589L10.3408 9.35539C10.2061 9.76612 9.8228 10.0438 9.39056 10.0438H5.339C4.35218 10.0438 3.96181 11.3216 4.78015 11.8731L7.98733 14.0345C8.36056 14.286 8.51977 14.7559 8.37632 15.1825L6.91151 19.5383Z" fill="#FF006B"/>
                    </svg>
                    <h1 class="username">{{user.username}}
                        <div class="status" :class="{'online': user.profile.status.isOnline && user.settings.privacy.show_status, 'disabled': !user.settings.privacy.show_status}"></div>
                    </h1>
                </div>
                <div class="row info">
                    <div class="infoField" v-if="token">
                        <button :style="themeColors" @click="toggleFriend()" v-if="user.username != me.username && !user.friends?.includes(user.username)" class="button">ADD FRIEND</button>
                        <button :style="themeColors" @click="toggleFriend()" v-if="user.username != me.username && user.friends?.includes(user.username)" class="button">REMOVE FRIEND</button>
                        <button :style="themeColors" class="button" v-if="user.username != me.username"><router-link :to="`/messages/${user.profile.username}`"><img src="../assets/chatroom.png" alt=""></router-link></button>
                        <button :style="themeColors" @click="block()" v-if="user.username != me.username && !user.settings?.privacy.blocked_users.includes(user.username)" class="button"><img src="../assets/flag.png" alt=""></button>
                        <button :style="themeColors" @click="block()" v-if="user.username != me.username && user.settings?.privacy.blocked_users.includes(user.username)" class="button">UNBLOCK</button>
                        <button :style="themeColors" v-if="user.username == me.username && !edit" @click="toggleEdit()" class="button"><img src="../assets/edit.svg" alt="Edit">EDIT</button>
                        <button :style="themeColors" v-if="user.username == me.username && edit" @click="toggleEdit()" class="button">SAVE</button>
                    </div>
                    <div class="splitter" v-if="token"></div>
                    <!-- <div class="infoField">
                        <p>Friends</p>
                    </div> -->
                </div>

                <div v-if="user.profile.socials" class="row socials">
                    <Socials :socials="user.profile.socials" :edit="edit"/>
                </div>

                <!-- <img class="settings" src="../assets/settings.svg" alt="Settings"> -->
            </div>
        </div>

        <div class="pageContent" :class="{darkmode: darkmode == 'true'}">
            <p class="tags"><strong>FAVORITE</strong> Anime</p>
            <div class="scrollableRegion animePosters" :class="{darkmode: darkmode == 'true'}">
                <router-link :to="`/anime/${id}`" class="posterContainer" v-for="id in user.profile.anime" :key="id" :id="id">
                    <img class="anime" width="84" :src="`http://taku.moe:8880/anime/posters/${id}.jpg`">
                    <Spinner/>
                </router-link>
            </div>
            
            <!-- COMPUTER SPECS -->
            <div v-if="user.profile.computer">
                <p class="tags" :class="{darkmode: darkmode == 'true'}"><strong>MY</strong> Computer</p>
                <MyComputer :computer="user.profile.computer" :edit="edit" :themeColors="themeColors"/>
            </div>

            <!-- OSU PROFILE -->
            <div v-if="user.profile.connections?.osu">
                <p class="tags"><strong>osu!</strong> Profile</p>
                <Osu :osu="user.profile.connections?.osu" :edit="edit"/>               
            </div>


            <p class="tags"><strong>DESCRIPTION</strong></p>
            <p class="description">{{user.profile.description}}</p>
            <p v-if="user.profile.achivements" class="tags"><strong>ACHIVEMENTS</strong></p>
        </div>
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import MyComputer from '@/components/profile/MyComputer.vue'
import Socials from '@/components/profile/Socials.vue'
import Osu from '@/components/profile/Osu.vue'

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

import axios from 'axios';

export default {
  name: 'user',
  components: {
    Spinner,
    MyComputer,
    Socials,
    Osu
  },
  data: () => {
    return {
      darkmode: localStorage.darkmode,
      token: localStorage.token,
      edit: false,
      me: {
          username: localStorage.username,
      },
      user: null,
      themeColors: {},
    };
  },
  updated: function () {
    this.$nextTick(function () {
        NProgress.done();
    }) 
  },
  mounted() {
    this.getUser();
    this.getMe();
  },
  watch: {
    $route(to, from) {
      this.getMe();
      this.getUser();
    }
  },
  methods: {
    async getMe() {
        NProgress.start();

        const me = await axios.get('http://taku.moe:8880/user', {
            withCredentials: true,
        });

        this.me = me.data;
        NProgress.done();
    },
    async getUser() {

        // Get user data
        let user = await axios.get(`http://taku.moe:8880/user/${this.$route.params.username}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
        user = Object.assign({}, user).data[0];


        try {
            this.themeColors = {
                '--themeColor': user.settings.appearance.theme_color,
                '--themeColorHover': `${user.settings.appearance.theme_color}66`,
            }
        } catch (error) {
            console.log(error);
            this.themeColors = {
                '--themeColor': '#ff006b',
                '--themeColorHover': '#ff006b66',
            }  
        }

        this.user = user;
        console.log(this.user);

    },
    async toggleFriend(){
        if (!this.user.friends) {
            this.user.friends = [];
        }
        if (!this.user.friends.includes(this.profile.username)) this.user.friends.push(this.profile.username)
        else this.user.friends.splice(this.user.friends.indexOf(this.profile.username), 1);
        this.updateSettings();

    },
    toggleEdit(){
        this.edit = !this.edit;
    },
    async block(){
        if (!this.profile.username) return

        if (!this.user.settings.privacy.blocked_users.includes(this.profile.username)) this.user.settings.privacy.blocked_users.push(this.profile.username)
        else this.user.settings.privacy.blocked_users.splice(this.user.settings.privacy.blocked_users.indexOf(this.profile.username), 1);
        this.updateSettings();
    },
    async updateSettings(){
        const response = await axios.post('http://taku.moe:8880/settings', this.user, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },
    async uploadFile(ref){
        NProgress.start();

        const file = this.$refs[ref].files[0];

        let formData = new FormData();
        formData.append(ref, file);

        const response = await axios.post('http://taku.moe:8880/settings/upload', formData, {
            withCredentials: true,
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });

        // If form submitted with no error:
        if(response.data.status == 200) {
            this.user.profile[ref] = response.data.link;
            await this.updateSettings();
            this.emitter.emit('refreshHeader');
            this.getProfileData();
        }
        else {
            console.log(response.data.error);
        }
        NProgress.stop();
    },
  }
}

</script>

<style scoped>


.userProfile::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 
  display: none;
}

.bannerContainer {
    width: 100%;
    position: relative;
    overflow: hidden;
}

.gradient {
    z-index: 2;
    position: absolute;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 27.08%, rgba(0, 0, 0, 0) 71.35%, rgba(0, 0, 0, 0.4) 100%);
    height: 256px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.gradient img {
    width: 96px;
    height: 96px;
    cursor: pointer;
}

.banner {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 256px;
    width: 100%;
}

.heading {
    height: 116px;
    max-width: 100%;
    padding: 0px 12px;
    display: flex;
    justify-content: left;
    flex-direction: column;
    position: relative;
}

.heading.darkmode {
    background: #10121D;
    color: white;
}

.pfp {
    transform: translateY(-60px);
    width: 122px;
    height: 122px;
    min-width: 122px;
    z-index: 4;
    position: absolute;
}

.pfp .image {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 100%;
    width: 100%;
    height: 100%; 
    display: flex;
    justify-content: center;
    align-items: center;
}

.pfp .image img {
    width: 64px;
    height: 64px;
    cursor: pointer;
}

.pfp .username {
    font-size: 36px;
    color: white;
    top: 12px; 
    text-align: left;
    left: 138px;
    position: absolute;

    display: flex;
    align-items: center;
}

.status {
    width: 24px;
    height: 8px;
    margin-left: 12px;
    margin-top: 4px;
    border-radius: 32px;
    border: solid 4px transparent;
    position: relative;
    border: solid 4px gray;
}

.status.online {
    border: solid 4px #3BE220;
}

.settings {
    width: 32px;
    height: auto;
    position: absolute;
    right: 206px;
    margin-top: calc((116px - 32px) / 2);
}

.button {
    border: none;
    height: 38px;
    border-radius: 32px;
    outline: none;
    background: var(--themeColor);
    color: white;

    font-size: 14px;
    letter-spacing: 0.11rem;
    right: 206px;
    font-weight: 800;
    cursor: pointer;
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 7px 8px;
    margin-right: 8px;
    transition: 100ms ease;
}

.button a {
    height: 22px;
}

.button img {
    width: 22px;
    height: auto;
    filter: invert(1);
}

.button:hover {
    background: var(--themeColorHover);
}
.settings:hover {
    cursor:pointer;
}

.badge {
    position: absolute;
    font-size: 48px;
    color: #FF006B;
    bottom: 0px;
    right: 0px;
    user-select: none;
}

.userProfile {
    height: 100%;
    overflow-y: scroll;
}

.row {
    display: flex;
    flex-direction: row;
    height: fit-content;
    padding: 0px 8px;
}

.row.info {
    margin-left: 122px;
    padding-left: 0px;
}

.infoField {
    display: flex;
    flex-direction: row;
    margin-left: 16px;
    margin-top: 16px;

    height: fit-content;
    user-select: none;
}

.infoField.socials{
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-left: 0px;
    margin-top: 0px;
}

.infoField.socials img{
    width: 32px;
    height: auto;
    margin-left: 24px;
}

.infoField p {
    color: #7C7C7C;
    font-size: 14px;
    margin-top: 8px;
}

.splitter { 
    width: 1px;
    height: 54px;
    background: rgba(0, 0, 0, 0.15);
    margin-left: 24px;
    margin-top: 16px;
}

.friends { 
    font-size: 36px;
    line-height: 23px;
    color: #FF006B;
}



.pageContent {
    color: #414141;
    background: #F3F3F3;
    height: 100vh;
    width: 100%;
}

.pageContent.darkmode {
    background:  #08090E;
    color: white;
}


.tags {
    padding: 24px 24px 0px;
    font-size: 16px;
}

.animePosters {
    padding: 8px 24px 0px;
    display: flex;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: lightgray transparent;
    overflow-y: hidden;
    overflow-x: scroll;
    background: #F3F3F3;
}

.animePosters.darkmode {
    background:  #08090E;
    color: white;
}


.posterContainer {
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
}

.posterContainer svg {
    position: absolute;
    cursor: pointer;
}

.anime {
    height: 124px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    transition: 200ms ease;
    z-index: 2;
}

.description {
    padding: 8px 24px 0px;
    font-size: 14px;
}

@media only screen and (min-width: 715px)  {
    .banner, .gradient {
        height: 368px;
    }
}
@media only screen and (max-width: 715px)  {
    .heading {
        height: 144px;
    }
}

</style>