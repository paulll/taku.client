<template>
    <div class="anime">
        <div class="bannerContainer">
            <div v-if="anime.id" class="banner" :style="{'background-image' : `linear-gradient(0deg, rgba(255, 0, 107, 0.65), rgba(255, 0, 107, 0.75)), linear-gradient(0deg, #000000, #000000), url(${rootPath}:2087/anime/banners/${anime.id}.jpg)`}">
                <img class="poster" :src="`${rootPath}:2087/anime/posters/${anime.id}.jpg`" alt="">
                <div class="info">
                    <div class="title">
                        <h1>{{anime.title.english}} 
                            <img v-if="!saved && token" @click="toggleAnime(anime.id, true)" src="../assets/bookmark.svg" alt="">
                            <img v-if="saved && token" @click="toggleAnime(anime.id, false)" src="../assets/bookmark-filled.svg" alt="">
                        </h1>
                        <h2>{{anime.year}}</h2>
                    </div>
                    <div class="desc">
                        <h3>Overview</h3>
                        <p>{{anime.description}}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="tags" ><strong>SUBMITED BY: </strong><router-link :to="`/profile/${anime.submitted_by}`">{{anime.submitted_by}}</router-link></p> 
        <p class="tags" ><strong>TAGS: </strong>{{anime.tags}}</p>
        <p class="tags" ><strong>BACKGROUNDS: </strong>(1337)</p>
    </div>
</template>

<script>

// Lifecycles
export default {
    name: 'anime',
    data: () => {
        return {
            token: localStorage.token,
            anime: {},
            name: "ass",
            saved: false,
        };
    },
    mounted() {
        this.getData();
    },
    watch: {
        $route(to, from) {
            this.getData();
        }
    },
    methods: {
        async toggleAnime(id, state) {
            this.saved = state;

            // Reset animation
            const json = JSON.stringify({anime: id, action: state});
            // const response = await axios.post(`${this.rootPath}:2087/user/anime`, json, {
            //     withCredentials: true,
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            const response = await this.api.anime.toggleAnime(json);

            // Display backend error
            if (response.data.error) {
                this.error = response.data.error;
                this.saved = true;
                setTimeout(() => {
                    this.error = "";
                }, 300);
            }

            this.saved = state;
        },
        async getData() {

            // Get user data
            this.user = await this.api.user.fetchMe();

            // Get anime data
            //let anime = await axios.get(`${this.rootPath}:2087/anime/id/${this.$route.params.id}/`, { headers: { 'Access-Control-Allow-Origin': '*' } });
            let anime = await this.api.anime.getAnime(this.$route.params.id)
            anime = Object.assign({}, anime).data.anime[0];
            anime.tags = anime.tags.join(", ");
            this.anime = anime;

            if (user.profile.anime_list.includes(anime.id)) this.saved = true;
        }
    }
}

</script>

<style scoped>

.bannerContainer { display: flex; }
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
    width: 112px;
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
    font-family: Work Sans, system-ui;;
}
.info h1 {
    position: relative;
    font-size: 28px;
    font-weight: 800;
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
    font-weight: 600;
}

.info p {
    overflow: scroll;
    height: fit-content;
    max-height: 70px;
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
