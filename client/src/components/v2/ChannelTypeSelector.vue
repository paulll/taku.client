<template>
  <menu class="view">
    <div @click="emitter.emit('channelViewUpdate', 'private')" :class="{'active': currentView == 'private'}">
      PRIVATE
      <div class="line"></div>
    </div>
    <div @click="emitter.emit('channelViewUpdate', 'group')" :class="{'active': currentView == 'group'}">
      GROUPS
      <div class="line"></div>
    </div>
    <div @click="emitter.emit('channelViewUpdate', 'invites')" :class="{'active': currentView == 'invites'}">
      INVITES
      <div class="line"></div>
    </div>
    <div @click="isShowingSortMenu = true">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.77349 9.59869C6.79149 9.61469 6.80849 9.62969 6.82549 9.64769C7.90449 10.7537 8.49949 12.2187 8.49949 13.7737V17.7577L10.7355 16.5397C10.9115 16.4437 11.0205 16.2557 11.0205 16.0487V13.7617C11.0205 12.2127 11.6095 10.7527 12.6785 9.65269L17.5155 4.50769C17.8285 4.17469 18.0005 3.73769 18.0005 3.27669V2.34069C18.0005 1.87669 17.6345 1.49969 17.1865 1.49969H2.31549C1.86649 1.49969 1.50049 1.87669 1.50049 2.34069V3.27669C1.50049 3.73769 1.67249 4.17469 1.98549 4.50669L6.77349 9.59869ZM8.14649 19.5007C7.94449 19.5007 7.74449 19.4467 7.56249 19.3387C7.21049 19.1287 6.99949 18.7577 6.99949 18.3457V13.7737C6.99949 12.6387 6.57649 11.5697 5.80549 10.7507C5.78249 10.7317 5.75949 10.7107 5.73949 10.6887L0.893488 5.53569C0.317488 4.92369 0.000488281 4.12069 0.000488281 3.27669V2.34069C0.000488281 1.04969 1.03949 -0.000305176 2.31549 -0.000305176H17.1865C18.4615 -0.000305176 19.5005 1.04969 19.5005 2.34069V3.27669C19.5005 4.11969 19.1835 4.92169 18.6095 5.53469L13.7625 10.6887C12.9595 11.5167 12.5205 12.6057 12.5205 13.7617V16.0487C12.5205 16.8047 12.1115 17.4967 11.4535 17.8567L8.69249 19.3607C8.52049 19.4537 8.33349 19.5007 8.14649 19.5007Z" fill="#676E78"/></svg>
      <SortingMenu v-if="isShowingSortMenu" @mouseleave="isShowingSortMenu = false"/>
    </div>
  </menu>
</template>

<script>
import SortingMenu from '@/components/v2/SortingMenu.vue'; 

export default {
    props: {
      currentView :{ type: String, required: true },
    },
    components: {
      SortingMenu,
    },
}
</script>

<style scoped>
menu.view {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
}

menu.view div {
  width: min-content;
  cursor: pointer;
}

menu.view div.active {
  color: var(--themeColor);
}

menu.view div .line {
  height: 3px;
  border-radius: 32px;
  width: 0%;
  margin-top: 2px;
  transition: 200ms ease;
}

menu.view div.active .line {
  background: var(--themeColor);
  width: 75%;
}

menu.view div, section h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 117.9%;
}

</style>