<template>
    <header :style="{
        'background-image': `linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://taku.moe:2087/banner/${uuid}')`,
        'top': `${posY - 40}px`,
        'left': `${posX + 24}px`,
        }">
        <div class="rootClass" :style="themeColors">
            <div class="miniProfile">
                <router-link :to="`/profile/${username}`" class="pfp">
                    <img class="channelPfp" :src="`https://taku.moe:2087/pfp/${uuid}`" alt="">
                </router-link>
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
        themeColors: { type: Object, required: false }, // Colors for the buttons
        profile:     { type: Object, required: true },  // User profile object
        username:    { type: String, required: true },  // Username asdfgpihojkl
        uuid:        { type: String, required: true },  // User uuid
        posX:        { type: Number, required: true },  // Mouse positions
        posY:        { type: Number, required: true },  // Mouse positions
    },
    components: {
        Status, 
    },
}
</script>

<style scoped>

header {
    top: 0px;
    left: 0px;
    min-width: 360px;
    background-color: #10121D;
    border-radius: 4px;
    overflow: hidden;
    position: fixed;
    height: 100px;
    transform: translateY(-24px);
    z-index: 5000000; 
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
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

.miniProfile {
    display: flex;
    gap: 8px;
}

.nameStatus {
    display: flex;
    gap: 8px;
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

.channelPfp {
    width: 64px;
    height: 64px;
}

</style>
