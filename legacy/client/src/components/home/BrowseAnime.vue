<template>
    <div class="section" v-if="animeList">
        <p class="headerText">{{translation('BROWSE Anime')}}</p>
        <div class="scrollRegion">
            <div class="animePosters" >
                <router-link :to="`/anime/${anime.id}`" class="posterContainer" v-for="anime in animeList" :key="anime.id" :id="anime.id">
                    <div class="anime" width="84" :style="{'background-image': `url('${rootPath}:2087/anime/posters/${anime.id}.jpg')`}"></div>
                    <Spinner/>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import translation from '@/services/translator.js';
import Spinner from '@/components/Spinner.vue'
import axios from 'axios';

export default {
    data: () => {
        return {
            animeList: null,
        }
    },
    async mounted(){
        this.animeList = (await axios.get(`${this.rootPath}:2087/anime/random`)).data.animeList;
        console.log(this.animeList);
    },
    methods: {
        translation
    }
}
</script>

<style>

.scrollRegion {
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    padding-bottom: 4px;
}

.animePosters {
    margin-top: 8px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(20, minmax(100px, 1fr));
}



</style>