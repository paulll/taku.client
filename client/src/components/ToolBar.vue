<script>
import TextInput from '@/components/messages/TextInput.vue';
    
export default {
  name: 'ToolBar',
  components: {
    TextInput
  },
  data: () => {
    return {
      darkmode: localStorage.darkmode,
      mode: "nav",
    };
  },
  watch: {
    $route(to, from) {
      if (to.path.startsWith("/dm") || to.path.startsWith("/group")) this.mode = 'msg';
      else this.mode = 'nav'
    }
  },
  mounted(){
    // Update the theme from the event emitter
    this.emitter.on('updateUI', () => this.updateUI());
  },
  methods: {
    updateUI(){
      this.darkmode = localStorage.darkmode;
    },
  }
};
</script>

<template>
  <div class="mh-headerContainer">
    <header class="mh-header" @update-theme="updateUI" :class="{darkmode: darkmode == 'true'}">
      <ul v-if="mode == 'nav'" class="mh-headerButtons">
        <li><router-link to="/" class="mh-headerButton"><img src="../assets/home.svg" alt=""></router-link></li>
        <li><router-link to="/anime" class="mh-headerButton"><img src="../assets/anime.svg" alt=""></router-link></li>
        <li><router-link to="/messages" class="mh-headerButton"><img src="../assets/chat.png" alt=""></router-link></li>
        <li><router-link to="/settings" class="mh-headerButton"><img src="../assets/settings.svg" alt=""></router-link></li>
      </ul>
      <ul v-if="mode == 'msg'" class="mh-headerButtons">
        <li><TextInput/></li>
      </ul>
    </header>
  </div>
</template>

<style scoped>

.router-link-active:not(.unreads) {
  filter: invert(26%) sepia(92%) saturate(7218%) hue-rotate(327deg) brightness(99%) contrast(109%);
}

a:not(.router-link-active) {
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
}


.mh-headerContainer{
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0px;
  width: 100%;
  z-index: 2; 
}

.mh-header {
  display: flex;
  background: white;
  width: 100%;
  border-radius: 32px 32px 0px 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: 100ms ease;
}

.mh-header.darkmode { background: var(--darkmodeDark); } /* darkmode */
.mh-header.darkmode img { filter: invert(1); }

@media only screen and (max-width: 715px){
  .mh-headerContainer { display: flex; }
  .mh-headerButtons {
    width: inherit;
    display: flex;
    transform: translateY(2px);
    flex-direction: row;
    justify-content: space-between;
    padding: 0px 16px;
    align-items: center;
    list-style: none; 
  }   
  .mh-headerButtons a {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: none;
  }
  .mh-headerButton img { padding: 20px; width: 28px; } 
  .mh-headerButtons li { display: flex; justify-content: center; width: 100%; }
}

.unreads {
  position: absolute;
  background: #0c97fa;
  border-radius: 100%;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px;
  transform: translate(20px, 0px);
  z-index: 1;
}

</style>
