<template>
    <div v-if="wallpaper">
        <div class="wallpaper" :style="{'background-image' : `url('https://taku.moe:2087/wallpapers/${wallpaper.fileName}')`}">
            <div class="anime"></div>
            <div class="quickButtons">
                <img id="qb1" src="../assets/wallpaper/Download.svg" alt="Download">
                <img id="qb2" src="../assets/wallpaper/Like.svg" alt="Like">
                <img id="qb3" src="../assets/wallpaper/Edit.svg" alt="Edit">
                <img id="qb4" src="../assets/wallpaper/Share.svg" alt="Share">
                <img id="qb5" src="../assets/wallpaper/Save.svg" alt="Save">
                <img id="qb6" src="../assets/wallpaper/Fullscreen.svg" alt="Fullscreen">
                <img id="qb7" src="../assets/wallpaper/Options.svg" alt="Options">
            </div>
        </div>
        {{wallpaper}}
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'wallpaper',
    data: () => {
        return {
            wallpaper: null,
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
        async downloadWallpaper(){
            await axios.get(`https://taku.moe:2087/wallpaper/download/${this.$route.params.wallpaper_uuid}`);
        }
    }
}

</script>

<style scoped>

@keyframes dropIn {
  0% { transform: translateY(-100px); }
  100% { transform: translateY(0px); }
}

.wallpaper {
    height: 717px;
    width: 1335px;
    display: flex;
    justify-content: space-between;
    padding: 8px;

    background: center no-repeat;
    background-size: cover;
    border-radius: 8px;
}

.quickButtons {
    transition: 100ms ease;
    cursor: pointer;
    display: grid;
    width: fit-content;
    height: fit-content;
    gap: 16px;
    grid-auto-flow: column;
}

.wallpaper:hover .quickButtons > * { 
    animation: .5s ease-in-out dropIn; 
}

#qb1 { animation-delay: 0ms; } 
#qb2 { animation-delay: 50ms; } 
#qb3 { animation-delay: 100ms; } 
#qb4 { animation-delay: 150ms; } 
#qb5 { animation-delay: 200ms; } 
#qb6 { animation-delay: 250ms; } 
#qb7 { animation-delay: 300ms; }

</style>
