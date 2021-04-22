<template>
    <div class="section" v-if="wallpapers">
        <p class="headerText">{{translation(sectionTitle)}}</p>
        <div class="scrollRegion" v-on:scroll.passive="handleScroll">
            <div class="wallpaper" :class="{darkmode: darkmode == 'true'}">
                <router-link :to="`/wallpaper/${wallpaper.uuid}`" class="wallpaperContainer" v-for="(wallpaper, index) of wallpapers" :key="{wallpaper}">
                    <div class="image" width="84" :style="{'background-image': `url('${rootPath}:2087/wallpapers/static/${wallpaper.filename}')`}">
                        <router-link :to="`/profile/${wallpaper.submitter.username}`" class="submitter">
                            <p class="submitterUsername">{{wallpaper.submitter.username}}</p> 
                            <div class="submitterPfp" :style="{'background-image': `url('https://taku.moe:2087/pfp/${wallpaper.submitter.uuid}')`}"></div>
                        </router-link>
                        <div class="menu" >
                            <img id="qb1" src="../../assets/wallpaper/Download.svg" alt="Download" @click="downloadWallpaper(wallpaper.uuid)">
                            <div v-if="me">
                                <img v-if="!wallpaper.likes.includes(me.uuid)"  id="qb2" src="../../assets/wallpaper/Like.svg"   alt="Like"    @click="interaction('likes', 'like', wallpaper.uuid, index)">
                                <img v-if="wallpaper.likes.includes(me.uuid)"   id="qb2" src="../../assets/wallpaper/Liked.svg"  alt="Dislike" @click="interaction('likes', 'dislike', wallpaper.uuid, index)">
                            </div>
                            <img src="../../assets/wallpaper/Options.svg" alt="Options">                           
                        </div>
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
            me: JSON.parse(localStorage.me),
            wallpapers: null
        }
    },
    async mounted(){
        this.wallpapers = (await axios.get(this.endpoint)).data.wallpapers; 
    },
    methods: {
        translation,
        downloadWallpaper(wallpaper_uuid){
            window.open(`${this.rootPath}:2087/wallpapers/download/${wallpaper_uuid}`);
        },
        async interaction(property, action, wallpaper_uuid){
            const response = await axios.post(`${this.rootPath}:2087/wallpapers/${action}/${wallpaper_uuid}`, undefined, {
                withCredentials: true,
                headers: {'Content-Type': 'application/json'}
            });
            if(!this.wallpapers[index][property].includes(this.me.uuid)) this.wallpaper[index][property].push(this.me.uuid);
            else this.wallpapers[index][property].pop(this.me.uuid);
        },
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
    border-radius: 12px;
    transition: 100ms ease;
    position: relative;
}

.menu {
    position: absolute;
    top: 8px;
    display: flex;
    gap: 8px;
    right: 8px;
    transition: 100ms ease;
    align-items: flex-start;
    opacity: 0%;
}

    
.menu * { transition: 100ms ease; }
.menu *:hover { transform: scale(1.1); }
.image:hover .menu, .image:hover .submitterUsername{ opacity: 100%; }

.submitter {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    transition: 100ms ease;
}

.submitterPfp {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    margin-left: 8px;
    background-size: contain;
    background-position: center;
}

.submitterUsername {
    opacity: 0%;
    transition: 100ms ease;
}

a {
    color: white;
    font-size: 14px;
    text-decoration: none;
    font-weight: 400;
}

a:hover { text-decoration: underline; }

</style>