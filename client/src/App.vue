<template>
  <div class="shit">
    <NavBar/>
    <Header/>
    <!-- <LoadingAnimation/> -->
    <router-view class="FUCKER"/>
    <ToolBar/>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import ToolBar from '@/components/ToolBar.vue'
import NavBar from '@/components/NavBar.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'

import socket from '@/services/socket.js';
import NProgress from 'nprogress';
import axios from 'axios';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

export default {
  name: 'Home',
  data: () => {
    return {
      user: {},
    };
  },
  components: {
    Header,
    ToolBar,
    NavBar,
    LoadingAnimation,
  },
  created(){
    NProgress.start();
    if (localStorage.token) this.getUser();
    if (!localStorage.settings) localStorage.setItem('settings', JSON.stringify({
      messages: {
        isChannellistVisible: true
      }
    }));
  },
  mounted(){
    NProgress.done();
  },
  unmounted() {
    // Disconnect socket when the app closes
    socket.disconnect();
  },
  methods: {
    async getUser() {

      try {
        var user = await axios.get(`${this.rootPath}:2087/user`, {
          withCredentials: true,
        });
      } catch (error) {
        if (error.status = 401) {
          localStorage.clear();
          window.location.href = `${this.rootPath}/login`;
          return
        }
      }

      this.user = user.data;
      socket.emit('user', user.data.uuid);
      // Start heartbeatting after the userdata has been received so
      this.heartBeat(60000);
    },
    async heartBeat(speed){
      if (localStorage.token && this.user.settings?.privacy?.show_status) {

        // Emit at start so we dont wait for the next interval
        socket.emit('heartbeat', {user: localStorage.token});
        console.log("emitting heartbeat");
        setInterval(() => {
          socket.emit('heartbeat', {user: localStorage.token});
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
  --textDark: #6D6E72;
  --textLight: #F3F3F3;
  --darker: #111215;
  --dark: #17191E;
  --light: #1D2026;
  --hoverOutline: #3A404D;
}

* {
  margin: 0;
  padding: 0;
  font-family: 'Work Sans', sans-serif;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: lightgray transparent;
  scrollbar-color: var(--light) var(--dark);
}

*.darkmode {
  scrollbar-color: var(--light) var(--dark);
}
*::-webkit-scrollbar {
  position: absolute; 
  width: 4px;
  height: 4px;
}
*::-webkit-scrollbar-track {
  background-color: transparent; 
}
*::-webkit-scrollbar-thumb {
  background-color: #888888;
  border-radius: 16px;  
}

*.darkmode::-webkit-scrollbar-thumb {
  background-color: var(--light);
}

html {
  width: 100vw;
  overflow: hidden;
  height: 100vh;
}

body {
  background: var(--dark); /* darkmode */
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

.shit {
  display: flex;
}

.FUCKER {
  padding: 16px;
  padding-top: 55px;
  height: 100vh;
  max-width: 100%;
  width: calc(100vw - 80px);
  background: white;
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
