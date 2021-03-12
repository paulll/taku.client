<template>
    <div class="home">
        <BrowseAnime/>
        <RandomWallpapers/>        
    </div>
</template>

<script>
import BrowseAnime from '@/components/home/BrowseAnime.vue';
import RandomWallpapers from '@/components/home/RandomWallpapers.vue';
// import smtp from '@/services/smtp.js';

export default {
    name: 'home',
    components: {
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

<style scoped>

.home {
    height: 100vh;
    overflow: scroll;
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

</style>
