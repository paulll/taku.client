<template>
    <header :style="{'background-image': `url('https://taku.moe:2087/banner/${uuid}')`}">
        <div class="rootClass" :style="themeColors">
            <div class="miniProfile">
                <div class="pfp">
                    <img class="channelPfp" :src="`https://taku.moe:2087/pfp/${uuid}`" alt="">
                </div>
                <div class="nameStatusButtons">
                    <div class="nameStatus">
                        <p>{{username}}</p>
                        <Status :profile="profile" :showText="true" size="big"/>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>


<script>

import Status from '@/components/v2/Status.vue'

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        themeColors:    { type: Object, required: false },      // Colors for the buttons
        profile:        { type: Object, required: true },       // User profile object
        username:       { type: String, required: true },       // Username asdfgpihojkl
        uuid:           { type: String, required: true },       // User uuid
    },
    components: {
        Status,
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    methods: {
        created(){
            this.themeColors = {
                '--themeColor': this.user.settings.appearance.theme_color,
                '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
            }
        },
    }
}
</script>

<style scoped>

header {
    position: absolute;
    min-width: 260px;
    background: #10121D;
    border-radius: 4px;
    overflow: hidden;
    height: 100px;
    left: 256px;
    transform: translateY(-60px);
    z-index: 5000000;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

header img {
  width: 100%;
  object-fit:cover; 
}

.rootClass {
    width: 100%;
    height: 100%;
    display: flex;
    color: white;  /* text color*/
    font-size: 24px;
    font-weight: 400;
    padding: 8px;
    border-radius: 4px;
}

.nameStatus {
    display: flex;
    align-items: center;
}

.nameStatus p {
    font-size: 24px;
    font-weight: 600;
}

.miniProfile{
    display: flex;
    flex-direction: row;
}
.pfp {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    overflow: hidden;
}
</style>
