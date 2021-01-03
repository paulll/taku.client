<template>
  <div class="signup">
      <div v-bind:class="{ step2: step == 2, step3: step == 3}"  class="bigtext">ANIHUU</div>
      <div class="container">

        <div class="formContainer">

            <transition name="bounce">
                <div class="error" :class="{ bounce: error }">
                    {{error}} 
                    <img src="https://cdn.discordapp.com/emojis/766139105645035540.png" alt="" :class="{ angery: angery }"> 
                    <p v-if="angery" class="angery">💢</p>
                </div>
            </transition>

            <form v-if="step == 1" v-on:submit.prevent="signup">

                <h1>Welcome to Anihuu!</h1>

                <div class="inputField">
                    <img src="../assets/user.png" alt="Username">
                    <input v-model="username" class="i" type="text" placeholder="Username">
                </div>

                <div class="inputField">
                    <img src="../assets/email.png" alt="Email">
                    <input v-model="email" class="i" type="email" placeholder="Email">
                </div>

                <div class="inputField">
                    <img src="../assets/password.png" alt="Password">
                    <input v-model="password" class="i" type="password" placeholder="Password">
                </div>

                <div class="inputField">
                    <img src="../assets/password.png" alt="Confirm Password">
                    <input v-model="repeatPassword" class="i" type="password" placeholder="Confirm Password">
                </div>

                <button type="submit">SIGNUP</button>

            </form>

            <form v-if="step == 2" v-on:submit.prevent="saveAnime">

                <h1>Choose your favorite anime</h1>

                <form class="searchBox" @submit.prevent="searchAnime(search)">
                    <img src="../assets/search.svg" alt="">
                    <input v-model="search" @keyup="searchAnime(search)" class="search" placeholder="SEARCH ANIME">
                </form>
                <div class="animeSelector">

                    <div v-if="animelist" class="animePosters">
                        <div class="posterContainer" v-for="anime in animelist" :key="anime" :id="anime.id" @click="select($event)" >
                            <img v-bind:class="{ selected: selectedAnime.has(anime.id.toString())}" :id="anime.id" class="anime" :src="`http://anihuu.moe:8880/anime/posters/${anime.id}.jpg`" alt="">
                            <svg v-if="selectedAnime.has(anime.id.toString())" width="46" height="36" viewBox="0 0 46 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.9402 0.165039L15.4048 24.2298L6.46488 15.4613L0.95166 20.8688L15.4048 35.0448L45.4534 5.57252L39.9402 0.165039Z" fill="#FF006B"/></svg>
                        </div>
                    </div>

                </div>

                
                <div class="buttonsStep2" v-if="step == 2">
                    <button class="backButton" @click="window.location.href = `http:/anihuu.moe/profile/${username}`"> SKIP</button>
                    <button type="submit">NEXT</button>
                </div>

            </form>

            <form v-if="step == 3" v-on:submit.prevent="addSocials">

                <h1>Add your socials links</h1>

                <div class="inputField" v-for="field in fields" :key="field">
                    <img src="../assets/_default.svg" alt="Text">
                    <input autocomplete="off" :id="field" v-model="socials[field - 1]" class="i" type="text" placeholder="Link...">
                </div>

                <svg class="addButton" @click="addField()" width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.4998 0.00976562C7.45864 0.00976562 0.916504 6.5519 0.916504 14.5931C0.916504 22.6343 7.45864 29.1764 15.4998 29.1764C23.541 29.1764 30.0832 22.6343 30.0832 14.5931C30.0832 6.5519 23.541 0.00976562 15.4998 0.00976562ZM15.4998 2.19727C22.3588 2.19727 27.8957 7.73411 27.8957 14.5931C27.8957 21.4521 22.3588 26.9889 15.4998 26.9889C8.64085 26.9889 3.104 21.4521 3.104 14.5931C3.104 7.73411 8.64085 2.19727 15.4998 2.19727ZM15.4827 7.28577C15.1929 7.2903 14.9167 7.40968 14.7149 7.61769C14.513 7.82571 14.4019 8.10535 14.4061 8.39518V13.4994H9.30192C9.15699 13.4973 9.01309 13.5241 8.87859 13.5781C8.7441 13.6322 8.62168 13.7124 8.51847 13.8142C8.41525 13.9159 8.33329 14.0372 8.27735 14.1709C8.2214 14.3046 8.19259 14.4482 8.19259 14.5931C8.19259 14.738 8.2214 14.8816 8.27735 15.0153C8.33329 15.149 8.41525 15.2703 8.51847 15.372C8.62168 15.4738 8.7441 15.554 8.87859 15.6081C9.01309 15.6621 9.15699 15.6889 9.30192 15.6869H14.4061V20.791C14.404 20.936 14.4308 21.0799 14.4849 21.2143C14.5389 21.3488 14.6191 21.4713 14.7209 21.5745C14.8227 21.6777 14.9439 21.7597 15.0777 21.8156C15.2114 21.8715 15.3549 21.9003 15.4998 21.9003C15.6448 21.9003 15.7883 21.8715 15.922 21.8156C16.0557 21.7597 16.177 21.6777 16.2788 21.5745C16.3805 21.4713 16.4608 21.3488 16.5148 21.2143C16.5689 21.0799 16.5956 20.936 16.5936 20.791V15.6869H21.6978C21.8427 15.6889 21.9866 15.6621 22.1211 15.6081C22.2556 15.554 22.378 15.4738 22.4812 15.372C22.5844 15.2703 22.6664 15.149 22.7223 15.0153C22.7783 14.8816 22.8071 14.738 22.8071 14.5931C22.8071 14.4482 22.7783 14.3046 22.7223 14.1709C22.6664 14.0372 22.5844 13.9159 22.4812 13.8142C22.378 13.7124 22.2556 13.6322 22.1211 13.5781C21.9866 13.5241 21.8427 13.4973 21.6978 13.4994H16.5936V8.39518C16.5957 8.24879 16.5684 8.10347 16.5133 7.96782C16.4582 7.83218 16.3764 7.70898 16.2728 7.60552C16.1692 7.50206 16.0459 7.42045 15.9102 7.36553C15.7745 7.3106 15.6291 7.28348 15.4827 7.28577Z" fill="#959595"/></svg>

                <div class="buttonsStep2" v-if="step == 3">
                    <button class="backButton" @click="step = 2"> BACK</button>
                    <button class="backButton" type="submit"> SKIP</button>
                    <button type="submit">FINISH</button>
                </div>

            </form>

        </div>
      </div>
  </div>
</template>

<script>

import axios from 'axios';
/* eslint-disable */

export default {
  name: 'signup',
  data: () => {
    return {
        error: "",
        angery: false,
        animelist: [],
        selectedAnime: new Set(),
        step: 1,
        fields: 1,
        socials: [],
    };
  },
  created() {
      this.step = 1;
  },
  mounted() {
      this.getAnime();
      console.log(this.step);
  },
  methods: {
    addField() {
        // If they do a second error become angry!!!!! 💢💢💢
        if (this.error) {
            this.angery = true;
            setTimeout(() => {
                this.angery = false;
            }, 300);
        }

        this.error = "";
        if (this.fields >= 5) return this.error = "5 socials max please, you can add more later! owo";
        this.fields += 1
        return 
    },
    async addSocials(){
        console.log(this.socials);

        const json = JSON.stringify({socials: [...this.socials], user: localStorage.token});
        const response = await axios.post('http://anihuu.moe:8880/user/socials', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Display backend error
        if (response.data.error) return this.error = response.data.error;

        // Finish and send the bitch home
        window.location.href = `/profile/${this.username}`;

    },
    select: function(event) {
        let targetId = event.currentTarget.id;

        if (this.selectedAnime.has(targetId)) {
            this.selectedAnime.delete(targetId);
            console.log(this.selectedAnime);
            return
        }

        this.selectedAnime.add(targetId);
        console.log(this.selectedAnime);    
    },
    async getAnime(){
        let result = await axios.get(`http://anihuu.moe:8880/anime`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.animelist = result.data.animelist;
        return
    },
    async searchAnime(search) {
        // Remove empty spaces
        search.trim();

        // If they cleared their search
        if(search == "") return this.getAnime();

        // Search for anime
        this.animelist = (await axios.get(`http://anihuu.moe:8880/anime/${search}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })).data.animelist;
    },
    async saveAnime(){

        // If they do a second error become angry!!!!! 💢💢💢
        if (this.error) {
            this.angery = true;
            setTimeout(() => {
                this.angery = false;
            }, 300);
        
        }

        // Reset animation
        this.error = "";
        if (this.selectedAnime.size < 3) return this.error = "Please select at least 3 of your favorite anime (个_个)";

        const json = JSON.stringify({anime: [...this.selectedAnime], user: localStorage.token});
        const response = await axios.post('http://anihuu.moe:8880/user/anime', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Display backend error
        if (response.data.error) return this.error = response.data.error;

        this.step = 3;

    },
    async signup() {
        
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
        if (!this.email) return this.error = "Email can't be empty (╯︵╰,)";
        if (!this.password) return this.error = "Password can't be empty (｡•́︿•̀｡)";
        if (!this.repeatPassword) return this.error = "Repeat your password too (个_个)";
        if (this.password.length <= 3) return this.error = "Password is too short (T_T)";
        if (this.password != this.repeatPassword) return this.error = "Passwords don't match o(〒﹏〒)o";


        // Trim space from username
        this.username = this.username.trim();

        const json = JSON.stringify({ 
            username: this.username,
            email: this.email,
            password: this.password,
        });

        // Send JSON to backend
        const response = await axios.post('http://anihuu.moe:8880/signup', json, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Display backend error
        if (response.data.error) return this.error = response.data.error;

        // Login 

        let loginJson = JSON.stringify({ 
            username: this.username,
            password: this.password,
        });

        // Send JSON to backend
        const loginResponse = await axios.post('http://anihuu.moe:8880/login', loginJson, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
            
        localStorage.token = loginResponse.data.token;
        localStorage.username = response.data.username;

        this.step = 2;

        // Get all anime
        this.getAnime();
    },
  }
}

</script>

<style scoped>

.slideup { transition: all .3s ease; transform: translateX(10px); }

.bigtext {
    font-size: 244px;
    font-weight: 900;
    font-style: italic;
    position: absolute;
    color: #FF006B;
    transition: 300ms ease;
    transform: rotate(90deg) translate(320px, 460px);
}

.step2 {
    transform: rotate(0deg) translate(0px, 0px);
}

.step3 {
    transform: translate(-100px, 300px) rotate(-28.9deg) ;
}

.addButton {
    margin-bottom: 16px;
    cursor: pointer;
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

    font-family: Work Sans;
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

    font-family: Work Sans;
    font-size: 13px;
    font-style: normal;
    font-weight: 800;
    line-height: 15px;
    letter-spacing: 0.11em;
    text-align: center;
    text-transform: uppercase;
    color: white;

    transition: 200ms ease;

    transform: translateY(200px);
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