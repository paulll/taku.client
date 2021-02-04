<template>
  <Header/>
  <router-view/>
  <MobileHeader/>
</template>

<script>
import Header from '@/components/Header.vue'
import MobileHeader from '@/components/MobileHeader.vue'

export default {
  name: 'Home',
  components: {
    Header,
    MobileHeader
  },
}


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  margin: 0;
  padding: 0;
  font-family: 'Work Sans', sans-serif;
  box-sizing: none;
}


body {
  background: white
}

.messageBubble .content img, .messageBubble .content iframe {
  border-radius: 12px;
  max-height: 368px;
  /* max-width: 256px; */
}

#app {
  overflow: hidden;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@media only screen and (max-width: 715px)  {
  .messageBubble .content img, .messageBubble .content iframe {
    max-width: 224px;
    height: auto;

  }
}
</style>
