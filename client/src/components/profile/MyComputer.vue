<template>
    <div>
        <div class="myComputerTabs" :style="themeColors">
            <div @click="switchTab(component.category)" :class="{imageBackground: true, active: activeTab == component.category}" v-for="component of computer" :key="component" >
                <img :class="{active: activeTab == component.category, darkmode: darkmode == 'true'}" :src="require(`../../assets/computer/${component.category}.png`)">
            </div>
        </div>
        <div class="myComputerItem">
            <div v-for="component of computer" :key="component" >
                <p v-if="!edit"  :style="themeColors" :class="{active: activeTab == component.category}" >{{component.item}}</p>
                <input v-if="edit" :class="{active: activeTab == component.category}" v-model="component.item" type="text" @change="updateSpecs">
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        computer:       { type: Object,  required: true },   // Computer object
        edit:           { type: Boolean, required: true },   // Check if edit is enabled or not
        themeColors:    { type: Boolean, required: true },   // Colors for the buttons
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
            token: localStorage.token,
        };
    },
    created(){
        this.activeTab = this.computer[0]?.category;
        this.themeColors = {
            '--themeColor': this.user.settings.appearance.theme_color,
            '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
        }
    },
    methods:{
        switchTab(tab){
            this.activeTab = tab;
            this.$forceUpdate();
        },
        async updateSpecs(){
            const response  = await axios.post('http://taku.moe:8880/user/computer', JSON.stringify({ user: this.token, computer: this.computer}), { 
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
        }
    }
}

</script>

<style scoped>

.myComputerTabs {
    display: flex;
    flex-direction: row;
    padding: 0px 24px 0px;
    margin-top: 8px;
    width: calc(100% - 32px);
}

.myComputerTabs .imageBackground{
    background: transparent;
    cursor: pointer;
    height: 48px;
}

.myComputerTabs .imageBackground.active {
    background: var(--themeColor);
    border-radius: 8px 8px 0px 0px;
}

/* by default the images are black */
.myComputerTabs img {
    width: 32px;
    height: 32px;
    padding: 4px;
}

/* if the image is active and the theme isn't darkmode invert it so it becomes white */
.myComputerTabs img.active {
    filter: invert(1); 
}

/* if darkmode is enabled or the image is active, the color is inverted so it becomes white */
.myComputerTabs img.darkmode, .myComputerTabs img.active {
    filter: invert(1);
}

.myComputerItem {
    padding: 0px 24px 0px;
    transform: translateY(-8px);
}

.myComputerItem p {
    display: none;
    background: var(--themeColor);;
    padding: 8px;
    color: white;
    border-radius: 8px 8px 8px 8px ;
    font-size: 16px;
    letter-spacing: 0px;
}

.myComputerItem input[type=text] {
    display: none;
    background: #ff006b;
    padding: 8px 0px;
    text-indent: 8px;
    border: 4px transparent;
    color: white;
    border-radius: 8px 8px 8px 8px ;
    outline: none;
    width: 100%;
    font-size: 16px;
    letter-spacing: 0px;
}

.myComputerItemInput input[type=text] {
    display: none;
    border: dashed 4px white;
}


.myComputerItem p.active, .myComputerItem input[type=text].active {
    display: block;
}

</style>
