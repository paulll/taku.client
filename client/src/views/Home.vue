<template>
    <div class="home">
        <BrowseAnime/>
        <Wallpapers :sectionTitle="'NEW Wallpapers'"        :endpoint="'https://taku.moe:2087/wallpapers/new/20/'"/>
        <Wallpapers :sectionTitle="'TRENDING Wallpapers'"   :endpoint="'https://taku.moe:2087/wallpapers/trending/20/'"/>
        <Wallpapers :sectionTitle="'RANDOM Wallpapers'"     :endpoint="'https://taku.moe:2087/wallpapers/random/20/'"/>
    </div>
</template>

<script>
import BrowseAnime from '@/components/home/BrowseAnime.vue';
import Wallpapers from '@/components/home/Wallpapers.vue';
// import smtp from '@/services/smtp.js';

export default {
    name: 'home',
    components: {
        Wallpapers,
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

.animePosters .anime:hover {
    transform: scale(1.04);
}

</style>
