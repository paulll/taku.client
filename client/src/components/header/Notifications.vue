<template >
    <div v-if="show" class="notificationBox" :class="{darkmode: darkmode == 'true'}">
        <p class="tags"><strong>NOTIFICATIONS</strong></p>
        <div class="users" :class="{darkmode: darkmode == 'true'}">
            <div class="notification" v-for="notification in notifications" :key="notification">
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
}

</script>

<style scoped>

.notificationBox {
    display: flex;
    position: absolute;
    width: 424px;
    max-width: 424px;
    height: fit-content;
    background: white;
    margin-top: 48px;
    right: 12px;
    border-radius: 16px;
    z-index: 5;
    padding: 8px 0px 8px 12px;
    flex-direction: column;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

</style>
