<template>
  <div class="signup">
      <div class="bigtext">taku</div>
      <div class="container">

        <div class="formContainer">

            <transition name="bounce">
                <div class="error" :class="{ bounce: error }">
                    {{error}} 
                    <img src="https://cdn.discordapp.com/emojis/766139105645035540.png" alt="" :class="{ angery: angery }"> 
                    <p v-if="angery" class="angery">💢</p>
                </div>
            </transition>

            <form v-on:submit.prevent="login">

                <h1>Welcome Back!</h1>

                <div class="inputField">
                    <img src="../assets/user.png" alt="Username">
                    <input v-model="username" class="i" type="text" placeholder="Username">
                </div>
                <div class="inputField">
                    <img src="../assets/password.png" alt="Password">
                    <input v-model="password" class="i" type="password" placeholder="Password">
                </div>

                <button type="submit">LOGIN</button>

            </form>
        </div>
      </div>
  </div>
</template>

<script>

import axios from 'axios';

const header = require("../components/Header");

/* eslint-disable */

export default {
  name: 'login',
  data: () => {
    return {
        error: "",
        angery: false,
    };
  },
  methods: {
    async login() {
        
        const usernameRegex = /^[a-zA-Z0-9.\-_]{3,30}$/;

        // If they do a second error become angry!!!!! 💢💢💢
        if (this.error) {
            this.angery = true;
            setTimeout(() => {
                this.angery = false;
            }, 300);
        
        } 

        // Reset animation
        this.error = "";

        if (!this.username) return this.error = "Username can't be empty (个_个)";
        if (this.username.length <= 3) return this.error = "Username is too short (´-ω-`)";
        if (!usernameRegex.test(this.username)) return this.error = "Username should contain only alphanumeric characters (╥﹏╥)";
        if (!this.password) return this.error = "Password can't be empty (｡•́︿•̀｡)";
        if (this.password.length <= 3) return this.error = "Password is too short (T_T)";

        // Trim space from username
        this.username = this.username.trim();

        const json = JSON.stringify({ 
            username: this.username,
            password: this.password,
        });

        // Send JSON to backend
        const response = await axios.post('http://taku.moe:8880/login', json, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Display backend error
        if (response.data.error) return this.error = response.data.error;

        // Redirect to home
        if (response.status == 200) {
            console.log(response.data);

            localStorage.token = response.data.token;
            localStorage.username = response.data.username;

            try {

                localStorage.setItem('language', response.data.user.settings.language);


                localStorage.setItem('typing', response.data.user.settings.sounds.typing.enabled);
                localStorage.setItem('mention', response.data.user.settings.sounds.mention.enabled);
                localStorage.setItem('notification', response.data.user.settings.sounds.notification.enabled);
                localStorage.setItem('hover', response.data.user.settings.sounds.hover.enabled);
                localStorage.setItem('click', response.data.user.settings.sounds.click.enabled);

                localStorage.setItem('typingSoundUrl', response.data.user.settings.sounds.typing.url);
                localStorage.setItem('mentionSoundUrl', response.data.user.settings.sounds.mention.url);
                localStorage.setItem('notificationSoundUrl', response.data.user.settings.sounds.notification.url);
                localStorage.setItem('hoverSoundUrl', response.data.user.settings.sounds.hover.url);
                localStorage.setItem('clickSoundUrl', response.data.user.settings.sounds.click.url);
            } catch (error) {
                console.log(error);
            }
            
            window.location.href = `/profile/${this.username.toLowerCase()}`;
        }
    },
  }
}

</script>

<style scoped>

.slideup {
  transition: all .3s ease;
  transform: translateX(10px);
}

.bigtext {
  font-size: 244px;
  font-weight: 900;
  font-style: italic;
  position: absolute;
  color: #FF006B;
  transition: 300ms ease;
  transform: rotate(90deg) translate(320px, 460px);
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
}

.formContainer {
    z-index: 2;
    padding: 24px;
}

.formContainer form:not(.searchBox) {
    display: flex;
    position: relative;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.11);
    background: white;
    padding: 24px;
}

.formContainer form *:not(button):not(.anime):not(svg) {
  margin-bottom: 16px;
}

.formContainer form h1 {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
}

.formContainer form input:not(.search) {
  width: 100%;
  height: 24px;
  padding: 0px 0px 14px 0px;

  font-weight: 500;
  font-size: 16px;

  outline: none;
  border: none;
  border-bottom: 2px solid #D8D8D8;
}

.formContainer form input:not(.search)::placeholder {
  opacity: 1;
}

.formContainer form button {
  width: 179px;
  height: 47px;
  border: none;
  outline: none;
  background: #FF006B;
  border-radius: 24px;

  font-family: Work Sans, system-ui;;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 117.9%;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #FFFFFF;
}

.formContainer form button:hover {
  cursor: pointer;
}

.inputField {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.inputField img {
  width: 35px;
  height: 35px;
  margin-right: 17px;
  transform: translateY(-6px)
}

.error {
    width: calc(100% - 24*2);
    height: 48px;
    background: #8075A2;


    padding: 0px 24px;

    border-radius: 8px 8px 0px 0px;
    border-bottom: 12px solid #BBABD5;

    display: flex;
    align-items: center;
    justify-content: center;

    font-family: Work Sans, system-ui;;
    font-size: 13px;
    font-style: normal;
    font-weight: 800;
    line-height: 15px;
    letter-spacing: 0.11em;
    text-align: center;
    text-transform: uppercase;
    color: white;

    transition: 200ms ease;

    transform: translateY(280px);
}

.error img {
    top: -112px;
    right: 24px;
    position: absolute;
}

.error .angery {
    top: -112px;
    right: 24px;
    position: absolute;
    font-size: 40px;
}

.bounce {
    animation: bounce-in .5s;
    transform: translateY(8px);
}

.angery {
    animation: shake .3s;
}

@keyframes bounce-in {
    0% {
        transform: translateY(300px);
    }
    50% {
        transform: translateY(-8px);
    }
    100% {
        transform: translateY(8px);
    }
}

@keyframes shake {
    0% {
        right: calc(24px + -0px);
    }
    10% {
        right: calc(24px + 8px);
    }
    20% {
        right: calc(24px + -8px);
    }
    30% {
        right: calc(24px + 8px);
    }
    40% {
        right: calc(24px + -0px);
    }
    50% {
        right: calc(24px + 8px);
    }
    60% {
        right: calc(24px + -8px);
    }
    70% {
        right: calc(24px + 8px);
    }
    80% {
        right: calc(24px + -0px);
    }
    90% {
        right: calc(24px + 8px);
    }
    100% {
        right: calc(24px + -0px);
    }
}



.searchBox {
    display: flex;
    width: 100%;
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

.animeSelector {
    background:white;
    border-radius: 8px;
    height: 200px;
    overflow: hidden;
    width: 100%;
}

.animePosters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 2fr));
    grid-template-rows: auto 1fr; /* NEW */

    position: relative;

    gap: 10px;
    align-content: top;
    scrollbar-width: thin;
    scrollbar-color: lightgray transparent;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
}

.animePosters::-webkit-scrollbar {
  width: 12px;               /* width of the entire scrollbar */
}

.animePosters::-webkit-scrollbar-track {
  background: white;        /* color of the tracking area */
}

.animePosters::-webkit-scrollbar-thumb {
  background-color: lightgray;    /* color of the scroll thumb */
  padding: 0px;
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 6px solid white;  /* creates padding around scroll thumb */
}

.posterContainer {
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
    height: 150px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    transition: 200ms ease;
}

.selected {
    filter: brightness(0.5);
}

.buttonsStep2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.backButton {
    width: fit-content !important;
    background: none !important;
    color: gray !important;
    margin-left: 16px;


}

</style>