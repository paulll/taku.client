<template >
    <div class="searchResults" >
        <p v-if="searchResults.users?.length > 0" class="tags"><strong>USERS</strong></p>
        <div class="users" >
            <router-link :to="`/profile/${user.username}`" class="user" v-for="user in searchResults?.users" :key="user">
                <Spinner/>
                <img :src="`${rootPath}:2087/pfp/${user.uuid}`" alt="">
                <p >{{user.username}}</p>
            </router-link>
        </div>
        <p v-if="searchResults.anime?.length > 0" class="tags"><strong>ANIME</strong></p>
        <div class="animeList" >
            <router-link :to="`/anime/${anime.id}`" class="animeWrap" v-for="anime in searchResults?.anime" :key="anime">
                <!-- <img :src="anime.settings.pfp" alt=""> -->
                <img class="animePoster" :src="`${rootPath}:2087/anime/posters/${anime.id}.jpg`" alt="Anime">
            </router-link>
        </div>

        <!-- <p class="tags"><strong>ANIME</strong></p> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        searchResults: { type: Array, required: true },
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    mounted(){
        this.emitter.on('updateUI', () => this.updateUI());
    },
    methods: {
        updateUI(){
            this.darkmode = localStorage.darkmode;
            this.typingSoundUrl = localStorage.typingSoundUrl;
            this.mentionSoundUrl = localStorage.mentionSoundUrl;
        },
        // async getDataSearch() {
        //     if (this.searchString.length == 0) {
        //         this.searchResults = [];
        //         return
        //     }
        //     const response  = await axios.post('http://localhost:2087/search/', JSON.stringify({ searchString: this.searchString}), { 
        //         withCredentials: true,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     this.searchResults = response.data;
        // },
    }
}

</script>

<style scoped>

.searchResults.darkmode {
    scrollbar-color: var(--light)var(--dark);
    background: var(--dark) !important;
    color: white !important;
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
  background-color: var(--light);
  border: 6px solid var(--dark); 
}


.search:focus ~ .searchResults, .searchResults:hover {
    display: flex;
}


.users {
    margin-bottom: 16px;
    display: flex;
    overflow-x: scroll;
    width: 100%;
    flex-direction: row;
    display: flex;
}

.users a {
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

.user p{
    color: black;
}

.user p.darkmode {
    color: white;
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

/* Small */
@media only screen and (max-width: 715px)  {
    .searchResults {
        width: calc(100vw - 36px);
    }
}
</style>
