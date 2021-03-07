<template>
    <div class="section" v-if="wallpapers">
        <p class="headerText">{{translation('RANDOM Wallpapers')}}</p>
        <div class="scrollRegion">
            <div class="wallpaper" :class="{darkmode: darkmode == 'true'}">
                <router-link :to="`/wallpaper/${wallpaper.uuid}`" class="posterContainer" v-for="wallpaper in wallpapers" :key="wallpaper">
                    <div class="image" width="84" :style="{'background-image': `url('https://taku.moe:2087/wallpapers/${wallpaper.fileName}')`}"></div>
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
            wallpapers: null,
        }
    },
    async mounted(){
        this.wallpapers = (await axios.get('https://taku.moe:2087/wallpapers/random/20')).data.wallpapers;
        console.log(this.wallpapers);
    },
    methods: {
        translation
    }
}
</script>

<style scoped>

.scrollRegion {
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    padding-bottom: 4px;
}

.wallpaper {
    margin-top: 8px;
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(20, minmax(100px, 1fr));
}

.wallpaper .image {
    height: 156px;
    width: 294.67px;
    background: center no-repeat;
    background-size: cover;
    border-radius: 8px;
}

</style>