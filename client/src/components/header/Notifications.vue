<template >
    <div v-if="show" class="notificationBox" :class="{darkmode: darkmode == 'true'}">
        <div class="heading">
            <div class="left">
                <p>{{translation('NOTIFICATIONS')}} ({{Object.keys(notifications).length}})</p>
            </div>
            <button class="clearNotifs" @click="emitter.emit('clearNotifications')"><img src="../../assets/trash.svg"></button>
        </div>

        <p v-if="Object.keys(notifications).length == 0" class="noNotifications">{{translation("You don't have any notifications!")}} <strong>(｡•́︿•̀｡)</strong></p>
        <div class="notification" :class="{darkmode: darkmode == 'true'}" v-for="notification in notifications" :key="notification">
            <transition name="slide-fade" :id="notification.uuid" >
                <div class="left" v-show='notification.show'>
                    <router-link :to="`/profile/${notification.from.username}`"><img :src="`http://taku.moe:8880/pfp/cache/${notification.from.uuid}`"></router-link>
                    <div class="text">
                        <router-link :to="`/profile/${notification.from.username}`"><p><strong>{{notification.from.username}}</strong> {{convert(notification.created_at)}}</p></router-link>
                        <router-link v-if="notification.in" :to="notification.in"><p>{{translation(notification.content)}}</p></router-link>
                        <router-link v-if="notification.at" :to="notification.at"><p>{{translation(notification.content)}}</p></router-link>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        notifications: { type: Array, required: true },
        show:          { type: Boolean, required: true },
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
            showNotif: false,
        };
    },
    mounted(){
        this.emitter.on('updateUI', () => this.updateUI());
    },
    methods: {
        
        // Fetches right translation of the site
        translation(sentence){
            if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
            else this.languageTable = require(`@/languages/${localStorage.language}.json`);
            let translatedSentence = this.languageTable[sentence];
            if (!translatedSentence) return sentence;
            return translatedSentence;
        },
        updateUI(){
            this.darkmode = localStorage.darkmode;
            this.typingSoundUrl = localStorage.typingSoundUrl;
            this.mentionSoundUrl = localStorage.mentionSoundUrl;
        },
        async friend(uuid, option){
            switch (option) {
                case "add":
                    // Fake adding the user so the front end reacts instantly
                    if (!this.me.friend_list.outgoing.includes(uuid) && !this.me.friend_list.friends.includes(uuid)) this.me.friend_list.outgoing.push(uuid);
                    break;
                case "remove":
                    // Fake remove the user so the front end reacts instantly
                    if (this.me.friend_list.outgoing.includes(uuid) || this.me.friend_list.friends.includes(uuid)) {
                        this.me.friend_list.outgoing.splice(this.me.friend_list.outgoing.indexOf(uuid), 1);
                        this.me.friend_list.friends.splice(this.me.friend_list.friends.indexOf(uuid), 1);
                    }
                    break;
            }

            const response = await axios.post(`http://taku.moe:8880/friend/${option}`, {uuid: uuid}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
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
/* what happens when the animation is currently active */
.slide-fade-enter-active {
  transform: translateX(256px);
}

/* where it will end up when the entering animation is done */
.slide-fade-enter-to {
  transform: translateX(0px);
  transition: all .1s ease;
}

/* apply the transition to the exit animation only when its active so it doesn't snap */
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(.61,.04,.83,.67);
}

/* where the leaving animation finishes off */
.slide-fade-leave-to {
  transform: translateX(256px);
  opacity: 0;
}

.notificationBox {
    display: flex;
    position: absolute;
    width: 424px;
    max-width: 424px;
    height: 500px;
    background: white;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-top: 48px;
    right: 12px;
    border-radius: 16px;
    z-index: 5;
    padding: 8px 0px 8px 12px;
    flex-direction: column;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.notificationBox.darkmode {
    background: var(--darkmodeDark);
    color: white;
}

.heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    outline: none;
    white-space: nowrap;
    border: none;
    background: transparent;
    font-weight: 500;
    color: #0094FF;
    font-size: 14px;
    text-transform: uppercase;
}

.clearNotifs {
    outline: none;
    border: none;
    margin-left: 8px;
    width: 24px;
    height: 24px;
    background: transparent;
    cursor: pointer;
}

.clearNotifs img {
    width: 24px;
    height: 24px;
}

.notificationBox.darkmode .clearNotifs img {
    filter: invert(1);
}

.notification {
    display: flex;
    align-items: center;
    margin: 8px 0px;
    justify-content: space-between;
    height: 32px;
}   

.left {
    display: flex;
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
    border-radius: 100%;
    width: 32px;
    height: 32px;
}

.notification button img {
    width: 24px;
    height: 24px;
}

.notification button {
    outline: none;
    border: none;
    margin-left: 8px;
    width: 24px;
    height: 24px;
    background: transparent;
    cursor: pointer;
}


.noNotifications {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    opacity: 40%;
}

.noNotifications strong {
    font-size: 48px;
    margin-top: 24px;
    color: #aaa;
}






</style>
