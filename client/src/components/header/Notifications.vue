<template >
    <div v-if="show" class="notificationBox" :class="{darkmode: darkmode == 'true'}">
        <p v-if="Object.keys(notifications).length == 0">You don't have any notifications! (｡•́︿•̀｡)</p>
        <div class="notification" :class="{darkmode: darkmode == 'true'}" v-for="notification in notifications" :key="notification">
            <router-link :to="`/profile/${notification.from.username}`"><img :src="`http://taku.moe:8880/pfp/cache/${notification.from.uuid}`"></router-link>
            <div class="text">
                <router-link :to="`/profile/${notification.from.username}`"><p><strong>{{notification.from.username}}</strong> {{convert(notification.created_at)}}</p></router-link>
                <p>{{notification.content}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        notifications: { type: Array, required: true },
        show:          { type: Boolean, required: true },
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
    mounted(){
        this.emitter.on('updateUI', () => this.updateUI());
    },
    methods: {
        updateUI(){
            this.darkmode = localStorage.darkmode;
            this.typingSoundUrl = localStorage.typingSoundUrl;
            this.mentionSoundUrl = localStorage.mentionSoundUrl;
        },
        convert(epoch) {
            const dt = new Date(epoch);

            const year = dt.getFullYear();
            const month = dt.getMonth();
            const day = dt.getDate();
            const hr = dt.getHours();
            const m = "0" + dt.getMinutes();

            var today = new Date();
            var dd = today.getDate()
            var mm = today.getMonth()
            var yyyy = today.getFullYear();
            
            today = `${dd}/${mm}/${yyyy}`;
            
            // If current date matches the notification date, only clock is displayed
            if(today == `${day}/${month}/${year}`)
                return `${hr}:${m.substr(-2)}`;
            else
                return `${hr}:${m.substr(-2)} - ${day}/${month}/${year}`;
        },
    }
}

</script>

<style scoped>

.notificationBox {
    display: flex;
    position: absolute;
    width: 424px;
    max-width: 424px;
    height: 500px;
    background: white;
    overflow-y: scroll;
    margin-top: 48px;
    right: 12px;
    border-radius: 16px;
    z-index: 5;
    padding: 8px 0px 8px 12px;
    flex-direction: column;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.notificationBox.darkmode {
    background: #020204;
    color: white;
}

.notification {
    display: flex;
    align-items: center;
    margin: 8px 0px;
}

.notification a {
    text-decoration: none;
    color: black;
    transition: 100ms ease;
    height: 32px;
}

.notification.darkmode a{
    color: white;
}

.notification a:hover {
    color: #ff006b
}

.notification .text {
    margin-left: 8px;
    font-size: 14px;
}

.notification img {
    width: 32px;
    height: 32px;
    border-radius: 100%
}







</style>
