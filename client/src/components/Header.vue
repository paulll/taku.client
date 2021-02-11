<template>
    <!-- HTML here -->
    <div class="header" :class="{pushRight: path}">
        <div class="container">
            <div class="searchBox">
                <img src="../assets/search.svg" alt="">
                <input class="search" placeholder="SEARCH">
            </div>

            <div class="buttons" v-if="!token">
                <router-link to="/login" class="login">LOGIN</router-link>
                <router-link to="/signup" class="signup">SIGNUP</router-link>
            </div>
            <div class="buttons" v-if="token">
                <router-link to="/dm" class="button"><img src="../assets/chat.png" alt=""></router-link>
            </div>
            <div class="buttons" v-if="token">
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

export default {
    data: () => {
        return {
            path: "",
            token: localStorage.token,
            user: "",
        }
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
    align-items: center; 
}

.searchBox  img {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-left: 12px;
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


</style>
