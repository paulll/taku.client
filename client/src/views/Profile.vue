hi<template>
    <div class="userProfile" :class="{darkmode: darkmode == 'true'}">
        <div class="bannerContainer">
            <div class="gradient">
                <input type="file" ref="banner" style="display: none" accept="image/*" v-on:change="uploadFile('banner')">
                <img @click="$refs.banner.click()" v-if="edit" src="../assets/edit.svg" alt="Edit">
            </div>
            <div class="banner" :style="{'background-image' : `url('${profile.settings?.banner}')`}">
            </div>
            <div class="heading" :class="{darkmode: darkmode == 'true'}">
                <div class="pfp">
                    <div v-if="profile.username" class="image" :style="{'background-image': `url('${profile.pfp}')`}">
                        <input type="file" ref="pfp" style="display: none" accept="image/*" v-on:change="uploadFile('pfp')">
                        <img @click="$refs.pfp.click()" v-if="edit" src="../assets/edit.svg" alt="Edit">
                    </div>
                    <svg v-if="profile.vip" class="badge" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.9644 26C11.1836 26 9.50959 25.6676 7.94247 25.0027C6.37534 24.3142 4.99817 23.3763 3.81096 22.189C2.62374 20.9781 1.68584 19.589 0.99726 18.0219C0.33242 16.4548 0 14.769 0 12.9644C0 11.1361 0.33242 9.43836 0.99726 7.87123C1.68584 6.28037 2.62374 4.9032 3.81096 3.73973C4.99817 2.55251 6.37534 1.63836 7.94247 0.99726C9.50959 0.33242 11.1836 0 12.9644 0C14.7927 0 16.4904 0.344293 18.0575 1.03288C19.6484 1.69772 21.0374 2.63562 22.2247 3.84658C23.4119 5.03379 24.3379 6.41096 25.0027 7.97808C25.6676 9.52146 26 11.1836 26 12.9644C26 14.769 25.6557 16.4548 24.9671 18.0219C24.3023 19.589 23.3763 20.9781 22.189 22.189C21.0018 23.3763 19.6128 24.3142 18.0219 25.0027C16.4548 25.6676 14.769 26 12.9644 26ZM6.91151 19.5383C6.601 20.4617 7.65966 21.2388 8.44753 20.6658L12.3792 17.8064C12.7284 17.5525 13.2012 17.5513 13.5516 17.8036L17.5645 20.6929C18.3531 21.2607 19.4064 20.4837 19.0967 19.5626L17.6237 15.1825C17.4802 14.7559 17.6394 14.286 18.0127 14.0345L21.2199 11.8731C22.0382 11.3216 21.6478 10.0438 20.661 10.0438H16.6038C16.1743 10.0438 15.7928 9.76954 15.6559 9.36239L13.924 4.20888C13.6175 3.29675 12.3257 3.30152 12.0259 4.21589L10.3408 9.35539C10.2061 9.76612 9.8228 10.0438 9.39056 10.0438H5.339C4.35218 10.0438 3.96181 11.3216 4.78015 11.8731L7.98733 14.0345C8.36056 14.286 8.51977 14.7559 8.37632 15.1825L6.91151 19.5383Z" fill="#FF006B"/>
                    </svg>
                    <h1 class="username">{{profile.username}}
                        <div class="status" :class="{'online': profile.online, 'offline': !profile.online}"></div>
                    </h1>
                </div>
                <div class="row info">
                    <div class="infoField" v-if="token">
                        <button @click="toggleFriend()" v-if="profile.username != me.username && !user.friends?.includes(profile?.username)" class="button">ADD FRIEND</button>
                        <button @click="toggleFriend()" v-if="profile.username != me.username && user.friends?.includes(profile?.username)" class="button">REMOVE FRIEND</button>
                        <button class="button" v-if="profile.username != me.username"><router-link :to="`/messages/${profile.username}`"><img src="../assets/chatroom.png" alt=""></router-link></button>
                        <button @click="block()" v-if="profile.username != me.username && !user.settings?.privacy.blocked_users.includes(profile?.username)" class="button"><img src="../assets/flag.png" alt=""></button>
                        <button @click="block()" v-if="profile.username != me.username && user.settings?.privacy.blocked_users.includes(profile?.username)" class="button">UNBLOCK</button>
                        <button v-if="profile.username == me.username && !edit" @click="toggleEdit()" class="button"><img src="../assets/edit.svg" alt="Edit">EDIT</button>
                        <button v-if="profile.username == me.username && edit" @click="toggleEdit()" class="button">SAVE</button>
                    </div>
                    <div class="splitter" v-if="token"></div>
                    <div class="infoField">
                        <h1 class="friends">{{profile.total_friends}}</h1>
                        <p>Friends</p>
                    </div>
                </div>

                <div class="row socials">
                    <div class="socials" :class="{darkmode: darkmode == 'true'}">
                        <a v-if="profile.socials.twitter" class="twitter" target="_blank" :href="profile.socials.twitter"><img src="../assets/twitter.svg" alt="Twitter"></a>
                        <a v-if="profile.socials.youtube" class="youtube" target="_blank" :href="profile.socials.youtube"><img src="../assets/youtube.svg" alt="YouTube"></a>
                        <a v-if="profile.socials.instagram" class="instagram" target="_blank" :href="profile.socials.instagram"><img src="../assets/instagram.svg" alt="Instagram"></a>
                        <a v-if="profile.socials.twitch" class="twitch" target="_blank" :href="profile.socials.twitch"><img src="../assets/twitch.svg" alt="Twitch"></a>
                        <a v-if="profile.socials.tiktok" class="tiktok" target="_blank" :href="profile.socials.tiktok"><img src="../assets/tiktok.svg" alt="tiktok"></a>
                        <a v-if="profile.socials.tumblr" class="tumblr" target="_blank" :href="profile.socials.tumblr"><img src="../assets/tumblr.svg" alt="tumblr"></a>
                        <a v-if="profile.socials.pinterest" class="pinterest" target="_blank" :href="profile.socials.pinterest"><img src="../assets/pinterest.svg" alt="pinterest"></a>
                        <a v-if="profile.socials.facebook" class="facebook" target="_blank" :href="profile.socials.facebook"><img src="../assets/facebook.svg" alt="facebook"></a>
                        <a v-if="profile.socials.deviantart" class="deviantart" target="_blank" :href="profile.socials.deviantart"><img src="../assets/deviantart.svg" alt="deviantart"></a>
                        <a v-if="profile.socials.linkedin" class="linkedin" target="_blank" :href="profile.socials.linkedin"><img src="../assets/linkedin.svg" alt="linkedin"></a>
                        <a v-if="profile.socials.snapchat" class="snapchat" target="_blank" :href="profile.socials.snapchat"><img src="../assets/snapchat.svg" alt="snapchat"></a>
                        <a v-if="profile.socials.vkontakte" class="vkontakte" target="_blank" :href="profile.socials.vkontakte"><img src="../assets/vkontakte.svg" alt="vkontakte"></a>
                        <a v-if="profile.socials.reddit" class="reddit" target="_blank" :href="profile.socials.reddit"><img src="../assets/reddit.svg" alt="reddit"></a>
                        <a v-if="profile.socials.discord" class="discord" target="_blank" :href="profile.socials.discord"><img src="../assets/discord.svg" alt="discord"></a>
                    </div>
                </div>

                <!-- <img class="settings" src="../assets/settings.svg" alt="Settings"> -->
            </div>
        </div>

        <div class="pageContent" :class="{darkmode: darkmode == 'true'}">
            <p class="tags"><strong>FAVORITE</strong> Anime</p>
            <div class="scrollableRegion animePosters" :class="{darkmode: darkmode == 'true'}">
                <router-link :to="`/anime/${id}`" class="posterContainer" v-for="id in profile.anime_showcase" :key="id" :id="id">
                    <img class="anime" :src="`http://anihuu.moe:8880/anime/posters/${id}.jpg`" alt="Anime">
                </router-link>
            </div>
            <p v-if="profile.connections?.osu" class="tags"><strong>osu!</strong> Profile</p>
            <div v-if="profile.connections?.osu" class="scrollableRegion stats osu" :class="{darkmode: darkmode == 'true'}">
                <div class="stat">
                    <a :href="`https://osu.ppy.sh/users/${profile.connections?.osu.user_id}`" target="_blank"><img class="osuPfp" :src="`http://s.ppy.sh/a/${profile.connections?.osu.user_id}`" alt=""></a>
                </div>
                <div class="stat">
                    <h1 class="osuUsername">{{profile.connections?.osu.username}}</h1>
                    <a :href="`https://osu.ppy.sh/rankings/osu/performance?country=${profile.connections?.osu.country}`" target="_blank"><img class="osuFlag" :src="`https://osu.ppy.sh/images/flags/${profile.connections?.osu.country}.png`" alt=""></a> 
                    <div class="ranks">
                        <div>{{profile.connections?.osu.count_rank_ssh}}<img class="rank" src="../assets/osu/ssh.svg" alt=""></div>
                        <div>{{profile.connections?.osu.count_rank_ss}}<img class="rank" src="../assets/osu/ss.svg" alt=""></div>
                        <div>{{profile.connections?.osu.count_rank_sh}}<img class="rank" src="../assets/osu/sh.svg" alt=""></div>
                        <div>{{profile.connections?.osu.count_rank_s}}<img class="rank" src="../assets/osu/s.svg" alt=""></div>
                        <div>{{profile.connections?.osu.count_rank_a}}<img class="rank" src="../assets/osu/a.svg" alt=""></div>
                    </div>
                
                
                </div>
                <div class="stat big">
                    <h1>#{{numberWithCommas(profile.connections?.osu.pp_rank)}}</h1>
                    <p>Global Ranking</p>
                </div>

                <div class="stat big">
                    <h1>{{parseInt(profile.connections?.osu.level).toFixed(0)}}</h1>
                    <p>Level</p>
                </div>
                <div class="stat big">
                    <h1>{{Math.ceil(parseInt(profile.connections?.osu.pp_raw))}}</h1>
                    <p>pp</p>
                </div>

                <div class="stat big">
                    <h1>{{numberWithCommas(profile.connections?.osu.playcount)}}</h1>
                    <p>Maps Played</p>
                </div>
                <div class="stat big">
                    <h1>{{Math.floor(profile.connections?.osu.accuracy)}}%</h1>
                    <p>Accuracy</p>
                </div>
                <div class="stat big">
                    <h1>{{secondsToHours(profile.connections?.osu.total_seconds_played)}}</h1>
                    <p>Time Wasted</p>
                </div>
            </div>
            <p class="tags"><strong>TOP</strong> Backgrounds</p>
            <p class="tags"><strong>STATS</strong></p>
            <div class="stats">
                <div class="stat">
                    <h1>{{profile.total_anime}}</h1>
                    <p>Anime</p>
                </div>
                <div class="stat">
                    <h1>{{profile.total_likes}}</h1>
                    <p>Likes</p>
                </div>
                <div class="stat">
                    <h1>{{profile.total_comments}}</h1>
                    <p>Comments</p>
                </div>
                <div class="stat">
                    <h1>{{profile.total_uploads}}</h1>
                    <p>Uploads</p>
                </div>

            </div>
            <p class="tags"><strong>DESCRIPTION</strong></p>
            <p class="description">{{profile.description}}</p>
            <p v-if="profile.achivements" class="tags"><strong>ACHIVEMENTS</strong></p>



        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'user',
  data: () => {
    return {
        darkmode: localStorage.darkmode,
        token: localStorage.token,
        edit: false,
        me: {
            username: localStorage.username,
        },
        profile: {
            socials: {
                twitter: "",
                instagram: "",
                twitch: "",
                youtube: "",
            }
        },
        user: {
            friends: []
        },
    };
  },
  mounted() {
    this.getProfileData();
    this.getUser();
  },
  watch: {
    $route(to, from) {
      this.getUser();
      this.getProfileData();
    }
  },
  methods: {
    async getUser() {
      const user = await axios.get('http://anihuu.moe:8880/user', {
        withCredentials: true,
      });

      // Add the new settings structure on the user
      // This is here so old users don't have an issue with loading the settings
      // Once they will update their settings this will go on their database
      // In v1.0 this should be removed


      if (!user.data.settings.appearance) {
        user.data.settings.appearance = {
          darkmode: false,
          anime_pfps: true,
          typing_sfx: {
            enabled: true,
            url: ""
          },
          mention_sfx: {
            enabled: true,
            url: ""
          },
          theme_color: "#ff006b"
        }
      }

      if (!user.data.settings.appearance.flare) {
        user.data.settings.appearance.flare = {
          enabled: false,
          content: "",
          color: "#ffffff"
        }
      }

      this.user = user.data;

    },
    async getProfileData() {

        // Get user data
        let result = await axios.get(`http://anihuu.moe:8880/user/${this.$route.params.username}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
        result = Object.assign({}, result).data[0];

        if (result.settings.pfp) result.pfp = result.settings.pfp;

        console.log(result);
        result.total_anime = result.anime_showcase.length
        this.profile = result;
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

        console.log(this.user);
    },
    async updateSettings(){
      const response = await axios.post('http://anihuu.moe:8880/settings', this.user, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
      });
    },
    async uploadFile(ref){
      const file = this.$refs[ref].files[0];

      let formData = new FormData();
      formData.append(ref, file);

      const response = await axios.post('http://anihuu.moe:8880/settings/upload', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

        console.log(response.data.status);

      // If form submitted with no error:
      if(response.data.status == 200) {
        this.user.settings[ref] = response.data.link;
        await this.updateSettings();
        this.emitter.emit('refreshHeader');
        this.getProfileData();
      }
      else {
        console.log(response.data.error);
      }
    },
    numberWithCommas(x) {
        if (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    secondsToHours(d) {
        if (!d) return
        d = Number(d);
        var h = Math.floor(d / 3600);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
        return hDisplay; 
    }
  }
}

</script>

<style scoped>


.ranks {
    position: absolute;
    bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ranks div {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    margin-right: 8px;
}

.rank {
    width: 40px;
    height: auto;
}



.userProfile::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 
  display: none;
}

.bannerContainer {
    width: 100%;
    position: relative;
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
}

.status.online {
    border: solid 4px #3BE220;
}


.status.offline {
    border: solid 4px gray;
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
    background: #FF006B;
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
    background: #d30058;
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

.socials {
    transform: translateY(4px);
}


.socials.darkmode {
    filter: invert(1);
}

.socials a {
    width: fit-content;
} 

.socials img {
    margin-right: 16px;
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

.discord:hover { filter: invert(51%) sepia(97%) saturate(374%) hue-rotate(193deg) brightness(90%) contrast(89%); }
.twitter:hover { filter: invert(54%) sepia(35%) saturate(3150%) hue-rotate(175deg) brightness(97%) contrast(96%); }
.youtube:hover { filter: invert(21%) sepia(93%) saturate(7386%) hue-rotate(359deg) brightness(126%) contrast(121%); }
.instagram:hover { filter: invert(18%) sepia(76%) saturate(4594%) hue-rotate(303deg) brightness(101%) contrast(120%); }
.twitch:hover { filter: invert(10%) sepia(76%) saturate(7109%) hue-rotate(268deg) brightness(106%) contrast(126%); }
.tiktok:hover { filter: invert(83%) sepia(61%) saturate(519%) hue-rotate(149deg) brightness(89%) contrast(82%); }
.tumblr:hover { filter: invert(23%) sepia(18%) saturate(1054%) hue-rotate(176deg) brightness(97%) contrast(86%); }
.pinterest:hover { filter: invert(17%) sepia(97%) saturate(5845%) hue-rotate(344deg) brightness(86%) contrast(112%); }
.facebook:hover { filter: invert(38%) sepia(11%) saturate(3236%) hue-rotate(182deg) brightness(98%) contrast(86%); }
.deviantart:hover { filter: invert(63%) sepia(71%) saturate(3009%) hue-rotate(94deg) brightness(97%) contrast(96%); }
.linkedin:hover { filter: invert(24%) sepia(95%) saturate(1836%) hue-rotate(179deg) brightness(99%) contrast(89%); }
.snapchat:hover { filter: invert(79%) sepia(70%) saturate(891%) hue-rotate(2deg) brightness(113%) contrast(106%); }
.vkontakte:hover { filter: invert(44%) sepia(21%) saturate(961%) hue-rotate(171deg) brightness(95%) contrast(93%); }
.reddit:hover { filter: invert(29%) sepia(77%) saturate(2766%) hue-rotate(2deg) brightness(103%) contrast(105%); }


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

.animePosters.darkmode {
  scrollbar-color: #363952#08090E ;
}

.scrollableRegion::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 

}
.scrollableRegion::-webkit-scrollbar-track {
  background-color: transparent; 
}
.scrollableRegion::-webkit-scrollbar-thumb {
  background-color: #888888;
  border: 6px solid #F3F3F3; 
  border-radius: 16px;
}

.scrollableRegion.darkmode::-webkit-scrollbar-thumb {
  background-color: #363952;
  border: 6px solid #08090E; 
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
}

.description {
    padding: 8px 24px 0px;
    font-size: 14px;
}

.stats {
    display: flex;
    justify-content: left;
    padding: 8px 24px 0px;
} 
.stats.osu {
    grid-template-columns: repeat(6, 1fr);
    overflow-x: scroll;
    gap: 16px
}

.stat {
    line-height: 23px;
    display: flex;
    flex-direction: column;
    position: relative;
    white-space: nowrap;
}
.stat p {
    font-size: 14px;
}

.stat.big {
    margin-top: 6px;
}

.osuPfp {
    border-radius: 16px;
    width: 122px;
    height: 122px;
}

.osuUsername {
    font-size: 24px;
}

.osuFlag {
    margin-top: 8px;
    width: 48px;
    height: auto;
}

@media only screen and (min-width: 715px)  {
    .banner, .gradient {
        height: 368px;
    }

}

</style>