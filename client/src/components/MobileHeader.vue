<script>
/* eslint-disable*/

export default {
  name: 'MobileHeader',
};
</script>

<template>
  <div class="mh-headerContainer">
    <header class="mh-header">
      <ul class="mh-headerButtons">
        <li><router-link to="/" class="mh-headerButton"><img src="../assets/home.svg" alt=""></router-link></li>
        <li><router-link to="/submit" class="mh-headerButton"><img src="../assets/add.png" alt=""></router-link></li>
        <li><router-link to="/dm" class="mh-headerButton"><img src="../assets/chat.png" alt=""></router-link></li>
        <li><router-link to="/settings" class="mh-headerButton"><img src="../assets/settings.svg" alt=""></router-link></li>
      </ul>
    </header>
  </div>
</template>

<style scoped>

.router-link-active {
  border-bottom: 2px solid #FF006B;
  filter: invert(26%) sepia(92%) saturate(7218%) hue-rotate(327deg) brightness(99%) contrast(109%);
}


.mh-headerContainer{
  display: none;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 8px;
  width: 100%;
  z-index: 2;

}

.mh-header {
  display: flex;
  background: white;
  height: 48px;
  width: calc(100% - 16px);
  border-radius: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0px 12px rgba(0, 0, 0, 0.164);
}

@media only screen and (max-width: 715px)  {
  .mh-headerContainer { display: flex; }
  .mh-headerButtons {
    width: inherit;
    display: flex;
    transform: translateY(2px);
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    list-style: none; 
  }   
  .mh-headerButton img { width: 32px; }
}
</style>
