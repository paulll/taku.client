<template>
  <Header/>
  <router-view/>
  <MobileHeader/>
</template>

<script>
import Header from '@/components/Header.vue'
import MobileHeader from '@/components/MobileHeader.vue'
import io from 'socket.io-client';
import NProgress from 'nprogress';
import axios from 'axios';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export default {
  name: 'Home',
  data: () => {
    return {
      socket: io('ws://taku.moe:8880'),
      user: {},
    };
  },
  components: {
    Header,
    MobileHeader
  },
  created(){
    NProgress.start();
    if (localStorage.token) {
      this.getUser();
    }
  },
  mounted(){
    // Stop loading bar at the top
    NProgress.done();
  },
  unmounted() {
    // Disconnect socket when the app closes
    this.socket.disconnect();
  },
  methods: {
    async getUser() {

      try {
        var user = await axios.get('http://taku.moe:8880/user', {
          withCredentials: true,
        });
      } catch (error) {
        if (error.status = 403) {
          localStorage.clear();
          window.location.href = "http://taku.moe:8080/login";
          return
        }
      }

      this.user = user.data;

      // Start heartbeatting after the userdata has been received so
      this.heartBeat(60000);
    },
    async heartBeat(speed){
      if (localStorage.token && this.user.settings?.privacy?.show_status) {

        // Emit at start so we dont wait for the next interval
        this.socket.emit('heartbeat', {user: localStorage.token});
        console.log("emitting heartbeat");
        setInterval(() => {
          this.socket.emit('heartbeat', {user: localStorage.token});
        }, speed);
      }
    }
  },
}


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

:root {
  --themeColor: #ff006b;
  --darkmodeLight: #363952;
  --darkmodeDark: #10121D;
  --darkmodeDarker: #08090E;
}

* {
  margin: 0;
  padding: 0;
  font-family: 'Work Sans', sans-serif;
  box-sizing: none;
  scrollbar-width: thin;
  scrollbar-color: lightgray transparent;
  scrollbar-color: var(--darkmodeLight)var(--darkmodeDark) ;
}

*.darkmode {
  scrollbar-color: var(--darkmodeLight)var(--darkmodeDark) ;
}
*::-webkit-scrollbar {
  position: absolute; 

}
*::-webkit-scrollbar-track {
  background-color: transparent; 
}
*::-webkit-scrollbar-thumb {
  background-color: #888888;
  border: 6px solid #F3F3F3; 
  border-radius: 16px;
}

*.darkmode::-webkit-scrollbar-thumb {
  background-color: var(--darkmodeLight);
  border: 6px solid #10121D; 
}

html {
  width: 100vw;
  height: 100vh;
}

body {
  background: #fff; /* darkmode */
}

#nprogress .bar {
  background: #ff00b6;
  height: 3px
}

#nprogress .peg {
  box-shadow: 0 0 10px #ff00b6, 0 0 5px #ff00b6;
}

.messageBubble .content img, .messageBubble .content video, .messageBubble .content iframe {
  border-radius: 12px;
  max-height: 368px;
  /* max-width: 256px; */
}

#app {
  overflow: hidden;
  height: 100vh;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@media only screen and (max-width: 715px)  {
  .messageBubble .content img, .messageBubble .content video, .messageBubble .content iframe {
    max-width: 224px;
    height: auto;

  }
}
</style>
