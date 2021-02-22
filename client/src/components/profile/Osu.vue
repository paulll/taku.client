<template>
    <div>
        <div class="scrollableRegion stats osu" :class="{darkmode: darkmode == 'true'}">
            <div class="stat osuprofile">
                <Spinner/>
                <a :href="`https://osu.ppy.sh/users/${profile.id}`" target="_blank"><img class="osuPfp" :src="profile.avatar_url" alt=""></a>
            </div>
            <div class="stat">
                <h1 class="osuUsername">{{profile.username}}</h1>
                <a :href="`https://osu.ppy.sh/rankings/osu/performance?country=${profile.country}`" target="_blank"><img class="osuFlag" :src="`https://osu.ppy.sh/images/flags/${profile.country_code}.png`" alt=""></a> 
                <div class="ranks">
                    <div>{{profile.statistics.grade_counts.ssh}}<img class="rank" src="../../assets/osu/ssh.svg" alt=""></div>
                    <div>{{profile.statistics.grade_counts.ss}}<img class="rank" src="../../assets/osu/ss.svg" alt=""></div>
                    <div>{{profile.statistics.grade_counts.sh}}<img class="rank" src="../../assets/osu/sh.svg" alt=""></div>
                    <div>{{profile.statistics.grade_counts.s}}<img class="rank" src="../../assets/osu/s.svg" alt=""></div>
                    <div>{{profile.statistics.grade_counts.a}}<img class="rank" src="../../assets/osu/a.svg" alt=""></div>
                </div>           
            </div>
            <div class="stat big">
                <h1>#{{numberWithCommas(profile.statistics.pp_rank)}}</h1>
                <p>Global Ranking</p>
            </div>
            <div class="stat big">
                <h1>{{parseInt(profile.statistics.level.current)}}</h1>
                <p>Level</p>
            </div>
            <div class="stat big">
                <h1>{{Math.ceil(parseInt(profile.statistics.pp))}}</h1>
                <p>pp</p>
            </div>
            <div class="stat big">
                <h1>{{numberWithCommas(profile.statistics.play_count)}}</h1>
                <p>Maps Played</p>
            </div>
            <div class="stat big">
                <h1>{{Math.floor(profile.statistics.hit_accuracy)}}%</h1>
                <p>Accuracy</p>
            </div>
            <div class="stat big">
                <h1>{{secondsToHours(profile.statistics.play_time)}}</h1>
                <p>Time Wasted</p>
            </div>
        </div>
    </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'


export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        profile: { type: Object, required: true }, // Osu object
        edit: { type: Boolean, required: true }, // Check if edit is enabled or not
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    components: {
        Spinner
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
