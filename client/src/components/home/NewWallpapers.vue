<template>
    <div class="section" v-if="wallpapers">
        <p class="headerText">{{translation('NEW Wallpapers')}}</p>
        <div class="scrollRegion" v-on:scroll.passive="handleScroll">
            <div class="wallpaper" >
                <router-link :to="`/wallpaper/${wallpaper.uuid}`" class="wallpaperContainer" v-for="wallpaper in wallpapers" :key="wallpaper">
                    <div class="image" width="84" :style="{'background-image': `url('${rootPath}:2087/wallpapers/static/${wallpaper.filename}')`}"></div>
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
    props: {
        endpoint:{ type: String, required: true },
    },
    data: () => {
        return {
            wallpapers: null
        }
    },
    async mounted(){
        this.wallpapers = (await axios.get(this.endpoint)).data.wallpapers; 
    },
    methods: {
        translation,
        handleScroll: async function(e) {
            const currentPos = e.target.scrollLeft;
            const maxScroll = e.target.scrollWidth - e.target.offsetWidth;
            if (currentPos == maxScroll) {
                const moreWallpapers = (await axios.get(`${this.endpoint}${this.wallpapers.length + 1}`)).data.wallpapers;
                moreWallpapers.forEach(wallpaper => this.wallpapers.push(wallpaper));
            }
        }
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
    grid-template-columns: repeat(99999999, minmax(240px, 1fr));
}



</style>