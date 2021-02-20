<template>
    <div>
        <div class="scrollableRegion stats osu" :class="{darkmode: darkmode == 'true'}">
            <div class="stat osuprofile">
                <Spinner/>
                <a :href="`https://osu.ppy.sh/users/${osu.user_id}`" target="_blank"><img class="osuPfp" :src="`http://s.ppy.sh/a/${osu.user_id}`" alt=""></a>
            </div>
            <div class="stat">
                <h1 class="osuUsername">{{osu.username}}</h1>
                <a :href="`https://osu.ppy.sh/rankings/osu/performance?country=${osu.country}`" target="_blank"><img class="osuFlag" :src="`https://osu.ppy.sh/images/flags/${osu.country}.png`" alt=""></a> 
                <div class="ranks">
                    <div>{{osu.count_rank_ssh}}<img class="rank" src="../../assets/osu/ssh.svg" alt=""></div>
                    <div>{{osu.count_rank_ss}}<img class="rank" src="../../assets/osu/ss.svg" alt=""></div>
                    <div>{{osu.count_rank_sh}}<img class="rank" src="../../assets/osu/sh.svg" alt=""></div>
                    <div>{{osu.count_rank_s}}<img class="rank" src="../../assets/osu/s.svg" alt=""></div>
                    <div>{{osu.count_rank_a}}<img class="rank" src="../../assets/osu/a.svg" alt=""></div>
                </div>           
            </div>
            <div class="stat big">
                <h1>#{{numberWithCommas(osu.pp_rank)}}</h1>
                <p>Global Ranking</p>
            </div>
            <div class="stat big">
                <h1>{{parseInt(osu.level).toFixed(0)}}</h1>
                <p>Level</p>
            </div>
            <div class="stat big">
                <h1>{{Math.ceil(parseInt(osu.pp_raw))}}</h1>
                <p>pp</p>
            </div>
            <div class="stat big">
                <h1>{{numberWithCommas(osu.playcount)}}</h1>
                <p>Maps Played</p>
            </div>
            <div class="stat big">
                <h1>{{Math.floor(osu.accuracy)}}%</h1>
                <p>Accuracy</p>
            </div>
            <div class="stat big">
                <h1>{{secondsToHours(osu.total_seconds_played)}}</h1>
                <p>Time Wasted</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        osu: { type: Object, required: true }, // Osu object
        edit: { type: Boolean, required: true }, // Check if edit is enabled or not
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    created(){

        // this.activeTab = this.osu[0]?.category;
        // this.themeColors = {
        //     '--themeColor': this.user.settings.appearance.theme_color,
        //     '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
        // }
    },
    methods: {
        numberWithCommas(x) {
            if (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        secondsToHours(d) {
            if (!d) return
            d = Number(d);
            var h = Math.floor(d / 3600);

            var hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
            return hDisplay; 
        }
    }
}

</script>

<style scoped>

.stats {
    display: flex;
    justify-content: left;
    padding: 8px 24px 0px;
} 
.stats.osu {
    grid-template-columns: repeat(6, 1fr);
    overflow-x: scroll;
    gap: 16px
}

.stat {
    line-height: 23px;
    display: flex;
    flex-direction: column;
    position: relative;
    white-space: nowrap;
}
.stat p {
    font-size: 14px;
}

.stat.big {
    margin-top: 6px;
}

.stat.osuprofile a {
    z-index: 2;
}

.stat.osuprofile {
    justify-content: center;
    align-items: center;

}

.osuPfp {
    border-radius: 16px;
    width: 122px;
    height: 122px;
}

.osuUsername {
    font-size: 24px;
}

.osuFlag {
    margin-top: 8px;
    width: 48px;
    height: auto;
}

.ranks {
    position: absolute;
    bottom: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.ranks div {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    margin-right: 8px;
}

.rank {
    width: 40px;
    height: auto;
}


</style>
