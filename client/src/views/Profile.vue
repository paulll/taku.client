<template>
    <div class="user">
        <div class="bannerContainer">
            <div class="gradient"></div>
            <div class="banner" :style="{'background-image' : `url('${user.bannerURL}')`}"></div>
            <div class="heading">
                <div class="pfp">
                    <div v-if="user.username" class="image" :style="{'background-image' : `url('${user.pfp}')`}"></div>
                    <div v-if="user.vip" class="badge">✪</div>
                </div>
                <div class="infoField">
                    <h1>{{user.username}}</h1>
                    <p>{{user.role}}</p>
                </div>
                <div class="splitter"></div>
                <div class="infoField">
                    <h1>{{user.total_tomodachi}}</h1>
                    <p>Tomodachi</p>
                </div>
                <div class="splitter"></div>
                <div class="infoField">
                    <h1 class="uploads">{{user.total_uploads}}</h1>
                    <p>Uploads</p>
                </div>
                <div class="splitter"></div>
                <div class="infoField socials">
                    <a v-if="user.socials.twitter" class="twitter" target="_blank" :href="user.socials.twitter"><img src="../assets/twitter.svg" alt="Twitter"></a>
                    <a v-if="user.socials.youtube" class="youtube" target="_blank" :href="user.socials.youtube"><img src="../assets/youtube.svg" alt="YouTube"></a>
                    <a v-if="user.socials.instagram" class="instagram" target="_blank" :href="user.socials.instagram"><img src="../assets/instagram.svg" alt="Instagram"></a>
                    <a v-if="user.socials.twitch" class="twitch" target="_blank" :href="user.socials.twitch"><img src="../assets/twitch.svg" alt="Twitch"></a>
                    <a v-if="user.socials.tiktok" class="tiktok" target="_blank" :href="user.socials.tiktok"><img src="../assets/tiktok.svg" alt="tiktok"></a>
                    <a v-if="user.socials.tumblr" class="tumblr" target="_blank" :href="user.socials.tumblr"><img src="../assets/tumblr.svg" alt="tumblr"></a>
                    <a v-if="user.socials.pinterest" class="pinterest" target="_blank" :href="user.socials.pinterest"><img src="../assets/pinterest.svg" alt="pinterest"></a>
                    <a v-if="user.socials.facebook" class="facebook" target="_blank" :href="user.socials.facebook"><img src="../assets/facebook.svg" alt="facebook"></a>
                    <a v-if="user.socials.deviantart" class="deviantart" target="_blank" :href="user.socials.deviantart"><img src="../assets/deviantart.svg" alt="deviantart"></a>
                    <a v-if="user.socials.linkedin" class="linkedin" target="_blank" :href="user.socials.linkedin"><img src="../assets/linkedin.svg" alt="linkedin"></a>
                    <a v-if="user.socials.snapchat" class="snapchat" target="_blank" :href="user.socials.snapchat"><img src="../assets/snapchat.svg" alt="snapchat"></a>
                    <a v-if="user.socials.vkontakte" class="vkontakte" target="_blank" :href="user.socials.vkontakte"><img src="../assets/vkontakte.svg" alt="vkontakte"></a>
                    <a v-if="user.socials.reddit" class="reddit" target="_blank" :href="user.socials.reddit"><img src="../assets/reddit.svg" alt="reddit"></a>
                    <a v-if="user.socials.discord" class="discord" target="_blank" :href="user.socials.discord"><img src="../assets/discord.svg" alt="discord"></a>
                </div>
                <!-- <img class="settings" src="../assets/settings.svg" alt="Settings"> -->
               <button class="follow">FOLLOW</button>
            </div>
        </div>

        <div class="pageContent">
            <div class="page"></div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
/* eslint-disable */

export default {
  name: 'user',
  data: () => {
    return {
      user: {
        socials: {
            twitter: "",
            instagram: "",
            twitch: "",
            youtube: "",
        }
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {

        // Get user data
        let result = await axios.get(`http://anihuu.moe:8880/user/${this.$route.params.username}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
        result = Object.assign({}, result).data[0];
        this.user = result;

        // Get banner URL
        let bannerURL = await axios.get(`http://anihuu.moe:8880/banner/${result.banner}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
        bannerURL = Object.assign({}, bannerURL).data;
        this.user.bannerURL = bannerURL;
    },
  }
}

</script>

<style scoped>

.gradient {
    z-index: 2;
    position: absolute;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
    height: 256px;
    width: 100%;
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
    padding: 0px calc(174px + 32px);
    display: flex;
    justify-content: left;
}

.pfp {
    transform: translateY(-71px);
    width: 174px;
    height: 174px;
    min-width: 174px;
}

.pfp .image {
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 100%;
    width: 100%;
    height: 100%;

}

.settings {
    width: 32px;
    height: auto;
    position: absolute;
    right: 206px;
    margin-top: calc((116px - 32px) / 2);
}

.follow {
    width: 174px;
    height: 38px;
    position: absolute;
    border: none;
    background: #FF006B;
    border-radius: 32px;
    color: white;
    outline: none;
    font-size: 14px;
    letter-spacing: 0.11rem;
    right: 206px;
    font-weight: 800;
    margin-top: calc((116px - 38px) / 2);
}

.follow:hover {
    cursor: pointer;
}

.settings:hover {
    cursor:pointer;
}


.badge {
    position: absolute;
    font-size: 48px;
    color: #FF006B;
    bottom: -12px;
    right: 0px;
    user-select: none;
}

.infoField {
    display: flex;
    flex-direction: column;
    margin-left: 24px;
    margin-top: 16px;
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
    font-size: 18px;
}

.infoField h1 {
    font-size: 48px;
}

.splitter {
    width: 1px;
    height: 74px;
    background: rgba(0, 0, 0, 0.15);
    margin-left: 24px;
    margin-top: 20px;
}

.uploads {
    color: #FF006B;
}

.page {
    background: #F3F3F3;
    height: 710px;
    width: 100%;
}

.discord:hover {
    filter: invert(51%) sepia(97%) saturate(374%) hue-rotate(193deg) brightness(90%) contrast(89%);
}
.twitter:hover {
    filter: invert(54%) sepia(35%) saturate(3150%) hue-rotate(175deg) brightness(97%) contrast(96%);
}
.youtube:hover {
    filter: invert(21%) sepia(93%) saturate(7386%) hue-rotate(359deg) brightness(126%) contrast(121%);
}
.instagram:hover {
    filter: invert(18%) sepia(76%) saturate(4594%) hue-rotate(303deg) brightness(101%) contrast(120%);
}
.twitch:hover {
    filter: invert(10%) sepia(76%) saturate(7109%) hue-rotate(268deg) brightness(106%) contrast(126%);
}
.tiktok:hover {
    filter: invert(83%) sepia(61%) saturate(519%) hue-rotate(149deg) brightness(89%) contrast(82%);
}
.tumblr:hover {
    filter: invert(23%) sepia(18%) saturate(1054%) hue-rotate(176deg) brightness(97%) contrast(86%);
}
.pinterest:hover {
    filter: invert(17%) sepia(97%) saturate(5845%) hue-rotate(344deg) brightness(86%) contrast(112%);
}
.facebook:hover {
    filter: invert(38%) sepia(11%) saturate(3236%) hue-rotate(182deg) brightness(98%) contrast(86%);
}
.deviantart:hover {
    filter: invert(63%) sepia(71%) saturate(3009%) hue-rotate(94deg) brightness(97%) contrast(96%);
}
.linkedin:hover {
    filter: invert(24%) sepia(95%) saturate(1836%) hue-rotate(179deg) brightness(99%) contrast(89%);
}
.snapchat:hover {
    filter: invert(79%) sepia(70%) saturate(891%) hue-rotate(2deg) brightness(113%) contrast(106%);
}
.vkontakte:hover {
    filter: invert(44%) sepia(21%) saturate(961%) hue-rotate(171deg) brightness(95%) contrast(93%);
}
.reddit:hover {
    filter: invert(29%) sepia(77%) saturate(2766%) hue-rotate(2deg) brightness(103%) contrast(105%);
}

</style>