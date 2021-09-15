<template>
    <div v-if="section = 'favorite_anime'" id="favorite_anime" class="capsule" >
        <img draggable v-if="edit" class="move" src="@/assets/move.png">
        <p class="tags">{{translation('FAVORITE Anime')}}</p>
        <div class="scrollableRegion animePosters" >
            <router-link :to="`/anime/${id}`" class="posterContainer" v-for="id in user.profile.anime_list" :key="id" :id="id">
                <img class="anime" width="84" :src="`http://localhost:2087/anime/posters/${id}.jpg`">
                <Spinner/>
            </router-link>
        </div>
    </div>

    <div v-if="section = 'computer_specs' && user.profile.computer" id="computer_specs" class="capsule" >
        <img draggable v-if="edit" class="move" src="@/assets/move.png">
        <p class="tags" >{{translation('MY Computer')}}</p>
        <MyComputer :computer="user.profile.computer" :edit="edit" :themeColors="themeColors"/>
    </div>

    <div v-if="section = 'osu_profile' && user.profile.connections?.osu" id="osu_profile" class="capsule" >
        <img draggable v-if="edit" class="move" src="@/assets/move.png">
        <p class="tags">{{translation('osu! Profile')}}</p>
        <Osu :profile="user.profile.connections?.osu" :edit="edit"/>               
    </div>
    
    <div v-if="section = 'description'" id="description" class="capsule" >
        <img draggable v-if="edit" class="move" src="@/assets/move.png">
        <p class="tags">{{translation('DESCRIPTION')}}</p>
        <textarea v-if="!edit" class="description"  readonly='true'>{{user.profile.description}}</textarea>
        <textarea rows="10" cols="100" v-if="edit" class="description"  v-model="me.profile.description" type="text" >{{me.profile.description}}</textarea>
    </div>
</template>

<script>

import Spinner from '@/components/Spinner.vue'
import MyComputer from '@/components/profile/MyComputer.vue'
import Osu from '@/components/profile/Osu.vue'


export default {
    components: {
        MyComputer,
        Osu,
        Spinner
    },
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        user:    { type: Object, required: true }, // Socials object
        section: { type: String, required: true }, // Socials object
        edit:    { type: Boolean, required: true }, // Socials object
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    methods: {
        // Fetches right translation of the site
        translation(sentence){
            if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
            else this.languageTable = require(`@/languages/${localStorage.language}.json`);
            let translatedSentence = this.languageTable[sentence];
            if (!translatedSentence) return sentence;
            return translatedSentence;
        },
    }
}

</script>

<style scoped>

.tags {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
}


.animePosters {
    padding: 0px;
    display: flex;
    position: relative;
    scrollbar-width: thin;
    scrollbar-color: lightgray transparent;
    overflow-y: hidden;
    overflow-x: scroll;
    background: transparent;
}

.animePosters.darkmode {
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
    display: relative;
    resize: none;
    margin: 0px;
    border: 4px white;
    color: black;
    width: 100%;
    min-height: 128px;
    height: fit-content;
    background: transparent;
    border-radius: 8px 8px 8px 8px ;
    outline: none;
    font-size: 14px;
    letter-spacing: 0px;
}

.description.darkmode {
    color: white;
}

.description.active {
    display: block;
}

.capsule {
  background: white;
  padding: 24px 24px 8px 24px;
  border-radius: 8px;
  margin: 8px 0px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.2));
  width: calc(100% - 48px);
}

.capsule.darkmode { /* darkmode */
  background: #10121D;
  color: white;
}

</style>
