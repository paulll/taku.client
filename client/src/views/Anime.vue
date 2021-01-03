<template>
    <div class="anime">
        <div class="bannerContainer">
            <div class="banner" :style="{'background-image' : `linear-gradient(0deg, rgba(255, 0, 107, 0.65), rgba(255, 0, 107, 0.75)), linear-gradient(0deg, #000000, #000000), url(http://anihuu.moe:8880/anime/banners/${anime.id}.jpg)`}">
                <img class="poster" :src="`http://anihuu.moe:8880/anime/posters/${anime.id}.jpg`" alt="">
                <div class="info">
                    <div class="title">
                        <h1>{{anime.title}} <img src="../assets/bookmark.svg" alt=""></h1>
                        <h2>{{anime.year}}</h2>
                    </div>
                    <div class="desc">
                        <h3>Overview</h3>
                        <p>{{anime.description}}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="tags" ><strong>TAGS: </strong>{{anime.tags}}</p>
        <p class="tags" ><strong>BACKGROUNDS: </strong>(1337)</p>
    </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'anime',
  data: () => {
      return {
          anime: {},
      };
  },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            // Get user data
            let result = await axios.get(`http://anihuu.moe:8880/anime/id/${this.$route.params.anime_id}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
            result = Object.assign({}, result).data.anime[0];
            result.tags = result.tags.join(", ");
            this.anime = result;
            console.log(result);
        }
    }
}

</script>

<style scoped>

.bannerContainer {
    display: flex;

}

.banner {
    background-position: bottom;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    padding: 64px 24px 24px;
    background-blend-mode: normal, color, normal;
    display: flex;

}

.poster {
    height: 168px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    transition: 200ms ease;
}

.info {
    margin-left: 8px;
    display: flex;
    justify-content: space-between;
    color: white;
    flex-direction: column;
    font-family: Work Sans;
}

.info h1 {
    position: relative;
    font-size: 28px;
    padding-right: 32px;
}

.info h1 img {
    right: 0px;
    top: 0px;
    position: absolute;
    height: 32px;
    margin-top: 4px;
    cursor: pointer;
}



.info h2 {
    font-size: 22px;
    font-weight: 400;
}

.info h3 {
    font-size: 22px;
    font-weight: 700;
}

.info p {
    overflow: scroll;
    height: 70px;
    font-weight: 400;
    margin-bottom: 6px;
}

.info p::-webkit-scrollbar {
    display: none;
}

.tags {
    padding: 24px 24px 0px;
    font-size: 16px;
}

</style>
