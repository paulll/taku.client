<template>
    <div class="home">
        <BrowseAnime/>
        <RandomWallpapers/>
        <TrendingWallpapers/>
        <NewWallpapers/>
    </div>
</template>

<script>
import BrowseAnime from '@/components/home/BrowseAnime.vue';
import RandomWallpapers from '@/components/home/RandomWallpapers.vue';
import TrendingWallpapers from '@/components/home/TrendingWallpapers.vue';
import NewWallpapers from '@/components/home/NewWallpapers.vue';
// import smtp from '@/services/smtp.js';

export default {
    name: 'home',
    components: {
        TrendingWallpapers,
        NewWallpapers,
        RandomWallpapers,
        BrowseAnime
    },
    methods: {
        // connectToMail
    },
    mounted() {
        // smtp.connectToMail();
    }
};

</script>

<style>

.home {
    height: 100vh;
    overflow: scroll;
    padding: 16px 0px 16px 16px;
    background: white;
}

.section {
    margin-top: 16px;
    font-family: Work Sans;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;

    color: #2C394A;
}

.animePosters .anime {
    height: 156px;
    width: auto;
    background: center;
    border-radius: 8px;
    transition: 100ms ease;
}

.wallpaper .image {
    height: 156px;
    width: auto;

    background: lightgray center no-repeat;
    background-size: cover;
    border-radius: 8px;
    transition: 100ms ease;
}

.animePosters .anime:hover, .wallpaper .image:hover {
    transform: scale(1.04);
}

</style>
