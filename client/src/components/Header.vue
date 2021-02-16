<template>
    <!-- HTML here -->
    <div class="header" :class="{pushRight: path}">
        <div class="container">
            <div class="searchBox">
                <img class="glass" src="../assets/search.svg" alt="">
                <input class="search" placeholder="SEARCH" v-model="searchString" @keyup="getDataSearch()">
                
                <div class="searchResults" v-if="searchString.length > 0" :class="{darkmode: darkmode == 'true'}">
                    <p v-if="searchResults.users.length > 0" class="tags"><strong>USERS</strong></p>
                    <div class="users" :class="{darkmode: darkmode == 'true'}">
                        <router-link :to="`/profile/${user.username}`" class="user" v-for="user in searchResults?.users" :key="user">
                            <Spinner/>
                            <img :src="user.settings.pfp" alt="">
                            <p>{{user.username}}</p>
                        </router-link>
                    </div>
                    <p v-if="searchResults.anime.length > 0" class="tags"><strong>ANIME</strong></p>
                    <div class="animeList" :class="{darkmode: darkmode == 'true'}">
                        <router-link :to="`/anime/${anime.id}`" class="animeWrap" v-for="anime in searchResults?.anime" :key="anime">
                            <!-- <img :src="anime.settings.pfp" alt=""> -->
                            <img class="animePoster" :src="`http://anihuu.moe:8880/anime/posters/${anime.id}.jpg`" alt="Anime">
                        </router-link>
                    </div>

                    <!-- <p class="tags"><strong>ANIME</strong></p> -->
                </div>
            </div>

            <div class="buttons" v-if="!token">
                <router-link to="/login" class="login">LOGIN</router-link>
                <router-link to="/signup" class="signup">SIGNUP</router-link>
            </div>
            <div class="buttons small" v-if="token">
                <router-link to="/home" class="button"><img src="../assets/home.svg" alt=""></router-link>
            </div>
            <div class="buttons small" v-if="token">
                <router-link to="/anime" class="button"><img src="../assets/anime.svg" alt=""></router-link>
            </div>
            <div class="buttons small" v-if="token">
                <router-link to="/dm" class="button"><img src="../assets/chat.png" alt=""></router-link>
            </div>
            <div class="buttons small" v-if="token">
                <router-link to="/settings" class="button"><img src="../assets/settings.svg" alt=""></router-link>
            </div>
            <div class="buttons" v-if="token">
                <button @click="logout()" class="button">LOGOUT</button>
                <router-link :to='`/profile/${user.username}`'><div class="pfp" :style="{'background-image' : `url('${user.pfp}')`}"></div></router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Spinner from '@/components/Spinner.vue'

export default {
    data: () => {
        return {
            path: "",
            token: localStorage.token,
            user: "",
            searchString: "",
            searchResults: [],
            darkmode: localStorage.darkmode,
        }
    },
    components: {
        Spinner
    },
    watch: {
        $route(to, from) {
            this.path = to.params.setting;
        }
    },
    mounted(){
        this.path = this.$route.params.setting;
        this.getUser();

        this.emitter.on('refreshHeader', () => this.getUser());
    },
    methods: {
        logout(){
            localStorage.removeItem('token');
            window.location.href = "http://anihuu.moe:8080";
        },
        async getUser() {
            const response = await axios.get('http://anihuu.moe:8880/user', {
                withCredentials: true,
            });

            if (response.data.settings.pfp) response.data.pfp = response.data.settings.pfp;
            console.log(response.data);

            this.user = response.data;
            localStorage.removeItem("darmode");
            localStorage.setItem('darkmode', response.data.settings.appearance.darkmode);
        },
        async getDataSearch() {
            if (this.searchString.length == 0) {
                this.searchResults = [];
                return
            }
            const response  = await axios.post('http://anihuu.moe:8880/search/', JSON.stringify({ searchString: this.searchString}), { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.searchResults = response.data;
            console.log(this.searchResults);
        },
    }
}
</script>

<style scoped>
/* CSS here */

.searchResults.darkmode {
    scrollbar-color: #363952#08090E ;
    background: #08090E !important;
    color: white !important;
}

.users::-webkit-scrollbar, .animeList::-webkit-scrollbar {
  width: 12px;  
  position: absolute; 
}
.users::-webkit-scrollbar-track, .animeList::-webkit-scrollbar-track {
  background-color: transparent; 
}
.users::-webkit-scrollbar-thumb, .animeList::-webkit-scrollbar-thumb {
  background-color: #888888;
  border: 6px solid #F3F3F3; 
  border-radius: 16px;
}

.users.darkmode::-webkit-scrollbar-thumb, .animeList.darkmode::-webkit-scrollbar-thumb {
  background-color: #363952;
  border: 6px solid #08090E; 
}

.searchResults {
    display: none;
    position: absolute;
    width: 624px;
    max-width: 624px;
    height: fit-content;
    background: white;
    margin-top: 48px;
    border-radius: 16px;
    z-index: 5;
    padding: 8px 0px 8px 12px;
    flex-direction: column;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}
.search:focus ~ .searchResults, .searchResults:hover {
    display: flex;
};

.users {
    margin-bottom: 16px;
    flex-direction: column;
    overflow-x: scroll;
    width: 100%;
    background: white;
}

.users.darkmode {
    display: flex;
    overflow-x: scroll;
    width: 100%;

}

.users a {
    width: fit-content;
}

.user {
    display: flex;
    flex-direction: column;
    align-items: center;

    text-decoration: none;
    color: white;
    font-weight: 600;

    position: relative;
}

.user img {
    border-radius: 100%;
    width: 96px;
    height: 96px;
    margin-right: 8px;
    transition: 100ms ease;
    z-index: 2;
}

.user img:hover {
    transform: scale(1.04);
}


.animeList {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    background: transparent;
}

.animePoster {
    height: 124px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    transition: 200ms ease;
    margin-right: 8px;
}

.animeWrap {
    transition: 100ms ease;
}

.animeWrap:hover {
    transform: scale(1.04);
}


.header {
    /* Auto Layout */
    display: flex;
    position: fixed;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0px;
    
    right: 0px;
    width: 100%;
    transition: 100ms ease;
    z-index: 1000;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.header.pushRight {
    width: calc(100% - 56px);
}

.container {
    display: flex;
    justify-content: space-between;
    margin: 9px 12px;
    width: 100%;
}

.signup, .login, .button {
    display: flex;
    align-items: center;
    padding: 0px 18px;
    
    font-family: Work Sans;
    font-style: normal;
    font-weight: 800;
    font-size: 13px;
    line-height: 117.9%;
    font-style: none;
    text-decoration: none;
    user-select: none;

    text-align: center;
    letter-spacing: 0.11em;

    outline: none;
    border: none;

    border-radius: 24px;

    background: white;
    color: black;
}

.buttons {
    display: flex;
}

.button {
    margin-right: 14px;
    padding: 0px 8px;
    transition: 100ms ease;
}

.button:hover {
    background: #FF006B;
    color: white;
}

.button:hover img {
    filter: invert(1);
}

.button img {
    width: 24px;
    height: 24px;
}


.login {
    margin-right: 14px;
    background: #FF006B;
    color: white;
}

.signup:hover, .login:hover, .button:hover {
    cursor:pointer;
}

.searchBox {
    width: inherit;
    display: flex;
    position: relative;
}

.searchBox .glass {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-left: 12px;
    margin-top: 10px;
}

.search {
    text-indent: 16px;
    width: 100%;
    max-width: 600px;
    min-width: 16px;
    height: 39px;
    background: rgba(65, 63, 87, 0.25);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding-left: 24px;
    margin-right: 14px;
}

.search::placeholder {
    letter-spacing: 1px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 1;
}

.search:focus {
    outline: none;
}

.pfp {
    background-image: url('https://cdn.discordapp.com/attachments/691139128267505664/792734012149334036/unknown.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 39px;
    height: 39px;
    border-radius: 100%;
}

.pfp:hover {
    cursor:pointer;
    filter: saturate(2);
}


/* Small */
@media only screen and (max-width: 715px)  {
    .buttons.small {
        display: none;
    }
    .searchResults {
        width: calc(100vw - 36px);
    }
    .heading {
        height: 170px;
    }
}


</style>
