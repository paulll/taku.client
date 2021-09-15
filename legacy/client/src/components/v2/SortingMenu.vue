<template>
    <div class="menuContainer">
        <div class="buttonContainer">
            <div class="menuButton" :class="{active: sortType == 'alpha_asc'}" @click="setSortType('alpha_asc')">
                <h1>Alphabetical A-Z</h1>
                <img :src="require('@/assets/a-z.png')" alt="" width="24" height="24">
            </div>
            <div class="menuButton" :class="{active: sortType == 'alpha_desc'}" @click="setSortType('alpha_desc')">
                <h1>Alphabetical Z-A</h1>
                <img :src="require('@/assets/z-a.png')" alt="" width="24" height="24">
            </div>
            <div class="menuButton" :class="{active: sortType == 'status_asc'}" @click="setSortType('status_asc')">
                <h1>Status Latest</h1>
                <img :src="require('@/assets/show_status.png')" alt="" width="24" height="24">
            </div>
            <div class="menuButton" :class="{active: sortType == 'status_desc'}" @click="setSortType('status_desc')">
                <h1>Status Oldest</h1>
                <img :src="require('@/assets/show_status.png')" alt="" width="24" height="24">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // These are the props that need (or may not need) to be passed down from the parent
    data: () => {
        return {
            sortType: localStorage.sortType,
        }
    }, 
    mounted(){
        this.determineSortType();
    },
    methods: {
        determineSortType(){
            let sortType = this.sortType;
            if(sortType == '' || sortType == null) {
                localStorage.setItem('sortType', 'alpha_asc');
                sortType = 'alpha_asc';
            }
            return this.sortType = sortType;
        },
        setSortType(sortType){
            localStorage.sortType = sortType;
            this.sortType = sortType;
            this.emitter.emit('resortChannels', sortType);
        }
    }

}

</script>

<style scoped>
/* Dropdown Menu */
/* Auto Layout */

a {
    text-decoration: none;
}

.menuContainer {
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
    cursor: initial;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 167px;
    background: var(--dark);
    border: 1px solid #1D2026;
    box-sizing: border-box;
    box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}

.menuButton {
    border-radius: 4px;
    display: flex;
    width: 100%;
    gap: 8px;
    padding: 8px;
    cursor: pointer;
    justify-content: space-between;
}

.menuButton:hover {
    background: var(--light);
} 

.menuButton img {
    filter: invert(100%) sepia(12%) saturate(1439%) hue-rotate(292deg) brightness(116%) contrast(91%);
}

.active {
    background-color: #FF006B !important;
}

.menuContainer h1 {
    font-family: Work Sans;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 117.9%;
    /* identical to box height, or 17px */

    display: flex;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    color: #F3F3F3;
}



.buttonContainer {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

</style>