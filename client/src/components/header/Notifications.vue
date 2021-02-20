<template>
    <div :class="{darkmode: darkmode == 'true'}">
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
        notifications: { type: Array, required: true }, // Socials object
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
}

</script>

<style scoped>

</style>
