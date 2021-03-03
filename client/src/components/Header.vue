<template>
    <!-- HTML here -->
    <div class="header" :class="{pushRight: path}">
        <div class="container">
            <div class="searchBox">
                <img class="glass" src="../assets/search.svg" alt="">
                <input class="search" spellcheck="false" :placeholder="translation('Search')" v-model="searchString" @keyup="getDataSearch()">
                
                <SearchResults v-if="searchString.length > 0" :searchResults="searchResults"/>
            </div>

            <!-- SHOW SERVER CPU LOAD IN HEADER -->
            <div class="cpuLoad" v-if="!token || token">
                <div :class="{'ok': parseInt(cpu) <= 50, 'ohshit': parseInt(cpu) > 50 && parseInt(cpu) <= 80, 'serverOnFire': parseInt(cpu) > 80}">
                    <!-- <p v-if="serverIsUnreachable">Server Unreachable</p> -->
                    <p><AnimatedNumber :number="cpu"/>%</p>
                </div>
            </div>

            <!-- SHOW SERVER CPU LOAD IN HEADER -->
            <div class="cpuLoad" v-if="!token || token">
                <div :class="{'ok': parseInt(cpu) <= 50, 'ohshit': parseInt(cpu) > 50 && parseInt(cpu) <= 80, 'serverOnFire': parseInt(cpu) > 80}">
                    <!-- <p v-if="serverIsUnreachable">Server Unreachable</p> -->
                    <p><AnimatedNumber :number="ram"/>KB</p>
                </div>
            </div>

            <!-- SHOW SERVER CPU LOAD IN HEADER -->
            <div class="cpuLoad" v-if="!token || token">
                <div :class="{'ok': parseInt(fps) >= 56, 'ohshit': parseInt(fps) < 56 && parseInt(fps) >= 30, 'serverOnFire': parseInt(fps) < 30}">
                    <!-- <p v-if="serverIsUnreachable">Server Unreachable</p> -->
                    <p><AnimatedNumber :number="fps"/>FPS</p>
                </div>
            </div>

            <!-- SHOW PING IN THE HEADER -->
            <div class="ping" v-if="!token || token">
                <div :class="{'ok': parseInt(ping) <= 100, 'ohshit': parseInt(ping) > 100 && parseInt(ping) <= 250, 'dragan': parseInt(ping) > 250}">
                    <p v-if="parseInt(ping) > 1000">+</p>
                    <!-- <p v-if="serverIsUnreachable">Server Unreachable</p> -->
                    <p><AnimatedNumber :number="ping"/>ms</p>
                </div>
            </div>

            <div class="buttons" :style="themeColors"  v-if="!token">
                <router-link to="/login" class="login">{{translation("Login")}}</router-link>
                <router-link to="/signup" class="signup">{{translation("Signup")}}</router-link>
            </div>
            <!-- <div class="buttons small" :style="themeColors" v-if="token">
                <router-link to="/home" class="button"><img src="../assets/home.svg" alt=""></router-link>
            </div>
            <div class="buttons small" :style="themeColors" v-if="token">
                <router-link to="/anime" class="button"><img src="../assets/anime.svg" alt=""></router-link>
            </div> -->
            <div class="buttons small" :style="themeColors" v-if="token">
                <router-link to="/messages" class="button"><img src="../assets/chat.png" alt=""></router-link>
            </div>
            <div class="buttons small" :style="themeColors" v-if="token">
                <div v-if="notifications.length > 0" class="numberOfNotifs">{{notifications.length}}</div>
                <div class="button" @click="showNotifications = !showNotifications" ><img src="../assets/notification.png" alt=""></div>
            </div>

            <Notifications :notifications="notifications" :show="showNotifications"/> 

            <div class="buttons small" :style="themeColors" v-if="token">
                <router-link to="/settings" class="button"><img src="../assets/settings.svg" alt=""></router-link>
            </div>
            <div class="buttons" :style="themeColors" v-if="token && user">
                <router-link :to='`/profile/${user.username}`'><div class="pfp" :style="{'background-image' : `url('${user.pfp}')`}"></div></router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Spinner        from '@/components/Spinner.vue'
import Notifications  from '@/components/header/Notifications.vue'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import SearchResults  from '@/components/header/SearchResults.vue'

import axios from 'axios';
import socket from '@/services/socket.js';

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
    data: () => {
        return {
            path: "",
            token: localStorage.token,
            user: undefined,
            ping: null,
            cpu: null,
            ram: null,
            fps: null,
            darkmode: localStorage.darkmode,
            searchString: '',
            searchResults: [],
            themeColors: {},
            notifications: [],
            showNotifications: false,
        }
    },
    components: {
        Notifications,
        Spinner,
        AnimatedNumber,
        SearchResults
    }, 
    watch: {
        $route(to, from) {
            this.path = to.params.setting;
        }
    },
    mounted(){
        this.path = this.$route.params.setting;
        this.getUser();

        let lastLoop = new Date();

        if (!this.notificationSoundUrl) this.notificationSoundUrl = require("../../public/notification.wav");
        this.notificationSound = new Audio(this.notificationSoundUrl);
        // setInterval(async () => {           
        //     this.ping = await this.getPing();
        // }, 1000);

        this.getPing()

        socket.on('ping', epoch => this.ping = new Date().getTime() - epoch);
        socket.on('notification', async notification => {
            
            notification.show = false;                  // Set new notification to hidden when coming in
            this.notifications.unshift(notification);   // Add it to the array of notifications
            await sleep(10);
            this.notifications[0].show = true;          // After 10 ms make that notification visible
            this.notificationSound.play();              // Play the sound
        });

        this.emitter.on('refreshHeader', () => this.getUser());
        this.emitter.on('clearNotifications', () => this.clearNotifications());
    },
    created(){
        this.test();
    },
    unmounted() {
        // Disconnect socket when the app closes
        socket.disconnect();
    },
    methods: {
        async clearNotifications(){
            for (let i = 0; i < this.notifications.length; i++) {
                this.notifications[i].show = false;
                await sleep(30);
            }

            await axios.delete('https://taku.moe:2087/notifications', {
                withCredentials: true
            }); 

            this.emitter.emit('refreshHeader');
        },
        // Fetches right translation of the site
        translation(sentence){
            if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
            else this.languageTable = require(`@/languages/${localStorage.language}.json`);
            let translatedSentence = this.languageTable[sentence];
            if (!translatedSentence) return sentence;
            return translatedSentence;
        },
        async getDataSearch() {
            if (this.searchString.length == 0) {
                this.searchResults = [];
                return
            }
            const response  = await axios.post('https://taku.moe:2087/search/', JSON.stringify({ searchString: this.searchString}), { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.searchResults = response.data;
        },
        test() { 
            let lastLoop = new Date().getTime();
            let collectedFps = null;

            function step(timestamp) {
                let thisLoop = new Date().getTime(); 
                let fps = Math.floor(1000 / (thisLoop - lastLoop));
                lastLoop = thisLoop;
                collectedFps = fps;
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);

            setInterval(() => {
                this.fps = collectedFps;
            }, 1000);
        },
        async getUser() {
            const response = await axios.get('https://taku.moe:2087/user', {
                withCredentials: true,
            });

            if (response.data.profile.pfp) response.data.pfp = response.data.profile.pfp;

            this.user = response.data;

            console.log(this.user.notifications[0].list);
            this.notifications = [...this.user.notifications[0].list.reverse()];

            // Connected, let's sign-up for to receive messages for this room
            socket.emit('room', this.user.uuid);

            try {
                this.themeColors = {
                    '--themeColor': this.user.settings.appearance.theme_color,
                    '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
                }
            } catch (error) {
                this.themeColors = {
                    '--themeColor': '#ff006b',
                    '--themeColorHover': '#ff006b66',
                }  
            }

            localStorage.removeItem("darmode");
            localStorage.setItem('darkmode', response.data.settings.appearance.darkmode);
        },
        async getPing(){
            socket.emit('ping');
            let startTime = new Date().getTime();
            setInterval(() => {
                startTime = new Date().getTime();
                // I divided the ms by 2 because theres 2 requests going, one that emits "ping", and then waits for "pong"
                socket.emit('ping');
            }, 1000);

            socket.on('pong', stats => {
                this.ping = ((new Date().getTime() - startTime) / 2).toFixed(0);
                this.cpu = stats.cpu;
                this.ram = stats.ram;
            });
        }
    }
}
</script>

<style scoped>
/* CSS here */

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
    z-index: 6;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.header.pushRight {
    width: calc(100% - 56px);
}

.container {
    display: flex;
    justify-content: space-between;
    margin: 8px 12px;
    width: 100%;
}

.signup, .login, .button {
    display: flex;
    align-items: center;
    padding: 0px 18px;
    
    font-family: Work Sans, system-ui;
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
    position: relative;
}

.numberOfNotifs {
    border: solid #10121D;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    color: white;
    font-size: 10px;
    position: absolute;
    right: 4px;
    background: var(--themeColor);
    border-radius: 32px;
    height: 16px;
    width: fit-content;
    padding: 0px 5px;
    top: 0px;
    z-index: 4;
}

.button {
    margin-right: 14px;
    padding: 0px 8px;
    transition: 100ms ease;
}

.button:hover {
    background: var(--themeColor);
    color: white;
    /* filter: drop-shadow(0px 0px 8px var(--themeColor)); */
}

.button:hover img {
    filter: invert(1);
}

.button img {
    width: 24px;
    height: 24px;
}

.ping {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
}

.ping p {
    transition: 200ms ease;
    white-space: nowrap;
    display: flex;
}

.ping .ok { color: #3BE220; }
.ping .ohshit { color: rgb(255, 208, 0); }
.ping .dragan { color: #FF006B; }

.cpuLoad {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
}

.cpuLoad p {
    transition: 200ms ease;
    white-space: nowrap;
    display: flex;
}

.cpuLoad .ok { color: #3BE220; }
.cpuLoad .ohshit { color: rgb(255, 208, 0); }
.cpuLoad .serverOnFire { color: #FF006B; }

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

/* if width is more than 715px */
@media only screen and (min-width: 715px)  {
    .header .container {
        padding: 0px 32px;
    }
}

/* if width is more than 915px */
@media only screen and (min-width: 915px)  {
    .header .container {
        padding: 0px 64px;
    }
}

/* if width is more than 1215px */
@media only screen and (min-width: 1215px)  {
    .header .container {
        padding: 0px 168px;
    }
}


/* if width is more than 1215px */
@media only screen and (min-width: 1600px)  {
    .header .container {
        padding: 0px calc(368px)
    }
}

/* Small */
@media only screen and (max-width: 715px)  {
    .cpuLoad, .ping {
        display: none;
    }
    .buttons.small {
        display: none;
    }
    .heading {
        height: 170px;
    }
}



</style>
