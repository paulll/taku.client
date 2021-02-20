<template>
    <div class="row socials">
        <div v-if="socials" class="socials" :class="{darkmode: darkmode == 'true'}">
            <a v-if="edit" :class="edit" target="_blank" ><img :src="require(`../../assets/edit.svg`)" :alt="edit"></a>
            <a v-for="social in socials" :key="social" :class="social.platform.toLowerCase()" target="_blank" :href="social.link"> <img :src="require(`../../assets/socials/${social.platform.toLowerCase()}.svg`)" :alt="social.platform.toLowerCase()"></a>
        </div>
    </div>
</template>

<script>
export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        socials: { type: Object, required: true }, // Socials object
        edit: { type: Boolean, required: true },   // If editting or not
        edit: { type: Boolean, required: true },   // If editting or not
        edit: { type: Boolean, required: true },   // If editting or not
    },
    data: () => {
        return {
            darkmode: localStorage.darkmode,
        };
    },
}

</script>

<style scoped>
.socials { transform: translateY(4px); }
.socials.darkmode { filter: invert(1); }
.socials a { width: fit-content; } 
.socials a img { margin-right: 16px; width: 24px; height: 24px;} 

.discord:hover {    filter: invert(51%) sepia(97%) saturate(374%) hue-rotate(193deg) brightness(90%) contrast(89%); }
.twitter:hover {    filter: invert(54%) sepia(35%) saturate(3150%) hue-rotate(175deg) brightness(97%) contrast(96%); }
.youtube:hover {    filter: invert(21%) sepia(93%) saturate(7386%) hue-rotate(359deg) brightness(126%) contrast(121%); }
.instagram:hover {  filter: invert(18%) sepia(76%) saturate(4594%) hue-rotate(303deg) brightness(101%) contrast(120%); }
.twitch:hover {     filter: invert(10%) sepia(76%) saturate(7109%) hue-rotate(268deg) brightness(106%) contrast(126%); }
.tiktok:hover {     filter: invert(83%) sepia(61%) saturate(519%) hue-rotate(149deg) brightness(89%) contrast(82%); }
.tumblr:hover {     filter: invert(23%) sepia(18%) saturate(1054%) hue-rotate(176deg) brightness(97%) contrast(86%); }
.pinterest:hover {  filter: invert(17%) sepia(97%) saturate(5845%) hue-rotate(344deg) brightness(86%) contrast(112%); }
.facebook:hover {   filter: invert(38%) sepia(11%) saturate(3236%) hue-rotate(182deg) brightness(98%) contrast(86%); }
.deviantart:hover { filter: invert(63%) sepia(71%) saturate(3009%) hue-rotate(94deg) brightness(97%) contrast(96%); }
.linkedin:hover {   filter: invert(24%) sepia(95%) saturate(1836%) hue-rotate(179deg) brightness(99%) contrast(89%); }
.snapchat:hover {   filter: invert(79%) sepia(70%) saturate(891%) hue-rotate(2deg) brightness(113%) contrast(106%); }
.vkontakte:hover {  filter: invert(44%) sepia(21%) saturate(961%) hue-rotate(171deg) brightness(95%) contrast(93%); }
.reddit:hover {     filter: invert(29%) sepia(77%) saturate(2766%) hue-rotate(2deg) brightness(103%) contrast(105%); }
.soundcloud:hover { filter: invert(42%) sepia(76%) saturate(1275%) hue-rotate(2deg) brightness(104%) contrast(104%);}

</style>
