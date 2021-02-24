<template>
    <div class="ToolTip" :style="themeColors">
        <p>{{message}}</p>
    </div>
</template>


<script>
export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        message:        { type: String, required: true },
        themeColors:    { type: Object, required: false },   // Colors for the buttons
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    methods: {
        created(){
        this.activeTab = this.computer[0]?.category;
        this.themeColors = {
            '--themeColor': this.user.settings.appearance.theme_color,
            '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
        }
    },
    }
}
</script>

<style scoped>
.ToolTip {
    background: #10121D;
    width: 55px;
    position: absolute;
    left: -32px;
    top: -52px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 17px;
    color: white;  /* text color*/
    font-size: 14px;
    font-weight: 400;
    padding: 8px;
    border-radius: 8px;
    margin: 8px;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}
</style>
