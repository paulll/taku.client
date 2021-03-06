<template>
    <div v-if="wallpaper" class="wallpaperContainer">
        <div class="main">
            <div class="wallpaperWrapper" :class="{'fullscreen': isFullscreen}">
                <div class="gradient"></div>
                <div class="wallpaper" :style="{'background-image' : `url('https://taku.moe:2087/wallpapers/${wallpaper.fileName}')`}">
                    <div class="top">
                        <div class="anime"></div>
                        <div class="quickButtons">
                            <img id="qb1" src="../assets/wallpaper/Download.svg" alt="Download" @click="downloadWallpaper()">
                            <img v-if="!wallpaper.likes.includes(me.uuid)" id="qb2" src="../assets/wallpaper/Like.svg" alt="Like" @click="likeWallpaper()">
                            <img v-if="wallpaper.likes.includes(me.uuid)" id="qb2" src="../assets/wallpaper/Liked.svg" alt="Dislike" @click="dislikeWallpaper()">
                            <img v-if="!wallpaper.saves.includes(me.uuid)" id="qb2" src="../assets/wallpaper/Save.svg" alt="Save" @click="saveWallpaper()">
                            <img v-if="wallpaper.saves.includes(me.uuid)" id="qb2" src="../assets/wallpaper/Unsave.svg" alt="Unsave" @click="unsaveWallpaper()">
                            <img id="qb3" src="../assets/wallpaper/Edit.svg" alt="Edit">
                            <img id="qb4" src="../assets/wallpaper/Share.svg" alt="Share">
                            <img id="qb6" src="../assets/wallpaper/Fullscreen.svg" alt="Fullscreen" @click="isFullscreen = !isFullscreen">
                            <img id="qb7" src="../assets/wallpaper/Options.svg" alt="Options">
                        </div>
                    </div>
                    <div class="middle"></div>
                    <div class="bottom">
                        <div class="left">
                            <h1>{{new Date(wallpaper.created_at).toLocaleString()}}</h1>
                            <h1>{{wallpaper.resolution}}p - {{wallpaper.extension.toUpperCase()}} - {{transformFileSize(wallpaper.size, true)}}</h1>
                        </div>
                        <h1>{{wallpaper.fileName}}</h1>
                    </div>
                </div>
            </div>

            <div class="information">
                <div class="author"></div>
                <div class="tags">
                    <div class="tag" v-for="tag in wallpaper.tags" :key="tag">#{{tag.toLowerCase()}}</div>
                </div>
            </div>
            {{wallpaper}}
        </div>  
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'wallpaper',
    data: () => {
        return {
            me: JSON.parse(localStorage.me),
            wallpaper: null,
            isFullscreen: false,
        }
    },
    components: {
    },
    mounted(){
        this.getWallpaper();
    },
    methods: {
        async getWallpaper(){
            this.wallpaper = (await axios.get(`https://taku.moe:2087/wallpaper/${this.$route.params.wallpaper_uuid}`)).data;
        },
        downloadWallpaper(){
            window.open(`https://taku.moe:2087/wallpaper/download/${this.$route.params.wallpaper_uuid}`);
        },
        async likeWallpaper() {
            const response = await axios.post(`https://taku.moe:2087/wallpaper/like/${this.$route.params.wallpaper_uuid}`, undefined, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!this.wallpaper.likes.includes(this.me.uuid)) this.wallpaper.likes.push(this.me.uuid);
        },
        async dislikeWallpaper() {
            const response = await axios.post(`https://taku.moe:2087/wallpaper/like/${this.$route.params.wallpaper_uuid}`, undefined, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.wallpaper.likes.pop(this.me.uuid);
        },
        async saveWallpaper() {
            const response = await axios.post(`https://taku.moe:2087/wallpaper/save/${this.$route.params.wallpaper_uuid}`, undefined, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!this.wallpaper.saves.includes(this.me.uuid)) this.wallpaper.saves.push(this.me.uuid);
        },
        async unsaveWallpaper() {
            const response = await axios.post(`https://taku.moe:2087/wallpaper/unsave/${this.$route.params.wallpaper_uuid}`, undefined, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.wallpaper.saves.pop(this.me.uuid);
        },
        transformFileSize(bytes, si=false, dp=1) {
            const thresh = si ? 1000 : 1024;

            if (Math.abs(bytes) < thresh) {
                return bytes + ' B';
            }

            const units = si 
                ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
                : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
            let u = -1;
            const r = 10**dp;

            do {
                bytes /= thresh;
                ++u;
            } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


            return bytes.toFixed(dp) + ' ' + units[u];
        }

    }
}

</script>

<style scoped>

@keyframes dropDown {
  0% { transform: translateY(-44px); }
  100% { transform: translateY(0px); }
}

@keyframes pullUp {
  0% { transform: translateY(44px); }
  100% { transform: translateY(0px); }
}

.main {
    width: 80vw;
}

.wallpaperWrapper {
    position: relative;
    height: 717px;
    border-radius: 8px;
    overflow: hidden;
}

.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0px;
    overflow: initial;
}

.gradient {
    opacity: 0%;
    position: absolute;
    transition: 100ms ease;
    pointer-events: none;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 100%);
}

.wallpaper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;

    background: center no-repeat;
    background-size: cover;

    overflow: hidden;
}

.top, .middle, .bottom {
    z-index: 4;
    width: 100%;
    height: fit-content;
}

.top, .bottom {
    display: flex;
    justify-content: space-between;
}

.bottom {
    align-items: flex-end;
}

.bottom .left {
    display: grid;
    gap: 4px;
}

.bottom h1 {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 10px;

    color: rgba(255, 255, 255, 0.5);
}

.quickButtons {
    cursor: pointer;
    display: grid;
    width: fit-content;
    height: fit-content;
    gap: 16px;
    grid-auto-flow: column;
}

.top > * { 
    animation: 300ms ease dropDown;
    transform: translateY(-44px);
    transition: 100ms ease;
}

.bottom > * { 
    animation: 300ms ease pullUp;
    transform: translateY(44px);
    transition: 100ms ease;
}

.wallpaperWrapper:hover .gradient{
    opacity: 100%;
}

.wallpaper:hover .top > *:not(.top img:hover),
.wallpaper:hover .bottom > *:not(.bottom img:hover){
    transform: translateY(0px);
}

.quickButtons img:hover { 
    transform: scale(1.15);
}

.information {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
}

.tags {
    display: flex;
    justify-content: flex-end;
}

.tag {
    cursor: pointer;
    background: purple;
    padding: 4px 8px 4px 8px;
    border-radius: 32px;
    color: white;
    margin-right: 8px;
    width: fit-content;
    font-family: Work Sans;
    font-style: normal;
    font-size: 11px;
    font-weight: 600;
}


/* #qb7 { animation-delay: 0ms; } 
#qb6 { animation-delay: 50ms; } 
#qb5 { animation-delay: 100ms; } 
#qb4 { animation-delay: 150ms; } 
#qb3 { animation-delay: 200ms; } 
#qb2 { animation-delay: 250ms; } 
#qb1 { animation-delay: 300ms; } */

</style>
