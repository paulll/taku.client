<template>
    <div class="section" v-if="wallpapers">
        <p class="headerText">{{translation(sectionTitle)}}</p>
        <div class="scrollRegion" v-on:scroll.passive="handleScroll">
            <div class="wallpaper" :class="{darkmode: darkmode == 'true'}">
                <router-link :to="`/wallpaper/${wallpaper.uuid}`" class="wallpaperContainer" v-for="wallpaper in wallpapers" :key="wallpaper">
                    <div class="image" width="84" :style="{'background-image': `url('https://taku.moe:2087/wallpapers/static/${wallpaper.filename}')`}">
                        <router-link :to="`/profile/${wallpaper.submitter.username}`" class="submitter">
                            <p class="submitterUsername">{{wallpaper.submitter.username}}</p> 
                            <div class="submitterPfp" :style="{'background-image': `url('https://taku.moe:2087/pfp/${wallpaper.submitter.uuid}')`}"></div>
                        </router-link>
                    </div>
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
        endpoint:      { type: String, required: true },
        sectionTitle:  { type: String, required: true },
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

.image {
    height: 156px;
    width: auto;

    background: lightgray center no-repeat;
    background-size: cover;
    border-radius: 8px;
    transition: 100ms ease;
    position: relative;
}

.submitter {
    position: absolute;
    bottom: 4px;
    right: 4px;
    display: flex;
    align-items: center;
    transition: 100ms ease;
    opacity: 0%;
}

.submitter:hover {
    transform: scale(1.06);
}

.image:hover .submitter{
    opacity: 100%;
}

a {
    color: white;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
}
.submitterPfp {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    margin-left: 4px;
    background-size: contain;
    background-position: center;
}

</style>