<template>
    <div class="home">
        <BrowseAnime/>
        <PopularTags/>        
    </div>
</template>

<script>
import BrowseAnime from '@/components/home/BrowseAnime.vue';
import PopularTags from '@/components/home/PopularTags.vue';

export default {
    name: 'home',
    components: {
        PopularTags,
        BrowseAnime
    },
}

</script>

<style scoped>

.home {
    height: 100vh;
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
