<template>
  <div class="channelsContainer">
    <div>
      <div class="search">
        <div class="button">
          <input ref="search" class="searchBox" spellcheck="false" placeholder="Search users and channels" v-model="searchString" type="text" @keyup="filterSearch()">
          <div class="iconWrapper">
            <img src="../../assets/search.svg" alt="Search">
          </div>
        </div>
      </div>
      <menu class="view">
        <div @click="view = 'private'" :class="{'active': view == 'private'}">
          PRIVATE
          <div class="line"></div>
        </div>
        <div @click="view = 'group'" :class="{'active': view == 'group'}">
          GROUPS
          <div class="line"></div>
        </div>
        <div @click="view = 'invites'" :class="{'active': view == 'invites'}">
          INVITES
          <div class="line"></div>
        </div>
      </menu>

      <section v-if="groupChannels.some(channel => channel.isPinned == true)">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75137 13.1617C4.74169 13.4819 4.99473 13.7483 5.31526 13.7566C5.53968 13.7633 5.7681 13.7666 5.99983 13.7666C7.14532 13.7666 8.49248 13.7035 9.5558 13.3608C10.0881 13.1891 10.557 12.9451 10.8937 12.5968C11.2328 12.2461 11.4332 11.7942 11.4332 11.22C11.4332 10.6111 11.1977 10.1423 10.8213 9.78593C10.4477 9.4323 9.9383 9.19205 9.39026 9.0276C8.29467 8.69883 7.01196 8.66377 6.25424 8.65991L6.25377 8.65991L5.85878 8.65977L5.85826 8.65977C4.72154 8.66519 3.40943 8.73949 2.37886 9.08685C1.86289 9.26076 1.41006 9.5055 1.08547 9.85103C0.758645 10.1989 0.566504 10.6443 0.566504 11.2067C0.566504 11.5508 0.647171 11.958 0.921625 12.3438C1.19613 12.7297 1.65821 13.0852 2.40542 13.3367C2.71121 13.4413 3.03978 13.2759 3.1433 12.9745L3.14338 12.9743C3.2466 12.6714 3.08299 12.3434 2.77876 12.2412C2.28909 12.0763 2.02979 11.8838 1.89194 11.705C1.7558 11.5285 1.72986 11.3548 1.72986 11.2067C1.72986 10.7779 2.04342 10.4299 2.75982 10.1856C3.47403 9.94213 4.55325 9.81675 5.99983 9.81675C7.44638 9.81675 8.52549 9.94329 9.23959 10.189C9.95551 10.4353 10.2698 10.7864 10.2698 11.22C10.2698 11.6484 9.95632 11.9962 9.23988 12.2402C8.52565 12.4835 7.44642 12.6087 5.99983 12.6087C5.77925 12.6087 5.56216 12.606 5.34854 12.6L5.34854 12.6L5.34497 12.6C5.03988 12.6024 4.7605 12.8379 4.75137 13.1617ZM4.75137 13.1617C4.75137 13.1618 4.75136 13.1618 4.75136 13.1619L4.85132 13.1647L4.75137 13.1616C4.75137 13.1617 4.75137 13.1617 4.75137 13.1617ZM9.69094 3.90256C9.69094 1.87881 8.03487 0.233313 5.99983 0.233313C3.96482 0.233313 2.30805 1.87879 2.30805 3.90256C2.30805 5.92567 3.96484 7.57114 5.99983 7.57114C8.03486 7.57114 9.69094 5.92565 9.69094 3.90256ZM3.47208 3.90256C3.47208 2.51841 4.60541 1.39129 5.99983 1.39129C7.39426 1.39129 8.52759 2.51841 8.52759 3.90256C8.52759 5.28602 7.39427 6.41316 5.99983 6.41316C4.6054 6.41316 3.47208 5.28602 3.47208 3.90256Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>PINNED</h1>
      </section>

      <section v-if="privateChannels.length != 0 && view == 'private'">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75137 13.1617C4.74169 13.4819 4.99473 13.7483 5.31526 13.7566C5.53968 13.7633 5.7681 13.7666 5.99983 13.7666C7.14532 13.7666 8.49248 13.7035 9.5558 13.3608C10.0881 13.1891 10.557 12.9451 10.8937 12.5968C11.2328 12.2461 11.4332 11.7942 11.4332 11.22C11.4332 10.6111 11.1977 10.1423 10.8213 9.78593C10.4477 9.4323 9.9383 9.19205 9.39026 9.0276C8.29467 8.69883 7.01196 8.66377 6.25424 8.65991L6.25377 8.65991L5.85878 8.65977L5.85826 8.65977C4.72154 8.66519 3.40943 8.73949 2.37886 9.08685C1.86289 9.26076 1.41006 9.5055 1.08547 9.85103C0.758645 10.1989 0.566504 10.6443 0.566504 11.2067C0.566504 11.5508 0.647171 11.958 0.921625 12.3438C1.19613 12.7297 1.65821 13.0852 2.40542 13.3367C2.71121 13.4413 3.03978 13.2759 3.1433 12.9745L3.14338 12.9743C3.2466 12.6714 3.08299 12.3434 2.77876 12.2412C2.28909 12.0763 2.02979 11.8838 1.89194 11.705C1.7558 11.5285 1.72986 11.3548 1.72986 11.2067C1.72986 10.7779 2.04342 10.4299 2.75982 10.1856C3.47403 9.94213 4.55325 9.81675 5.99983 9.81675C7.44638 9.81675 8.52549 9.94329 9.23959 10.189C9.95551 10.4353 10.2698 10.7864 10.2698 11.22C10.2698 11.6484 9.95632 11.9962 9.23988 12.2402C8.52565 12.4835 7.44642 12.6087 5.99983 12.6087C5.77925 12.6087 5.56216 12.606 5.34854 12.6L5.34854 12.6L5.34497 12.6C5.03988 12.6024 4.7605 12.8379 4.75137 13.1617ZM4.75137 13.1617C4.75137 13.1618 4.75136 13.1618 4.75136 13.1619L4.85132 13.1647L4.75137 13.1616C4.75137 13.1617 4.75137 13.1617 4.75137 13.1617ZM9.69094 3.90256C9.69094 1.87881 8.03487 0.233313 5.99983 0.233313C3.96482 0.233313 2.30805 1.87879 2.30805 3.90256C2.30805 5.92567 3.96484 7.57114 5.99983 7.57114C8.03486 7.57114 9.69094 5.92565 9.69094 3.90256ZM3.47208 3.90256C3.47208 2.51841 4.60541 1.39129 5.99983 1.39129C7.39426 1.39129 8.52759 2.51841 8.52759 3.90256C8.52759 5.28602 7.39427 6.41316 5.99983 6.41316C4.6054 6.41316 3.47208 5.28602 3.47208 3.90256Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>USERS</h1>
      </section>
      <section v-if="groupChannels.length != 0 && view == 'group'">
        <h1>GROUPS</h1>
      </section>
      <section v-if="inviteChannels.length != 0 && view == 'invites'">
        <h1>INVITES</h1>
      </section>

      <Takuchii message="You don't have any dms!" emoji="(｡•́︿•̀｡)"         v-if="privateChannels.length == 0 && view == 'private'"/>
      <Takuchii message="You don't have any group chats!" emoji="(｡•́︿•̀｡)" v-if="groupChannels.length == 0 && view == 'group'"/>  
      <Takuchii message="You don't have any invites!" emoji="(｡•́︿•̀｡)"     v-if="inviteChannels.length == 0 && view == 'invites'"/>  
      <Takuchii message="I didn't find anyone!" emoji="｡･ﾟﾟ*(>д&lt;)*ﾟﾟ･｡"    v-if="privateChannels.length != 0 && searchString.length > 0 && searchDMS.length == 0 && view == 'private'"/>  
      <Takuchii message="I didn't find any groups!" emoji="(╥﹏╥)"         v-if="groupChannels.length != 0 && searchString.length > 0 && searchGroups.length == 0 && view == 'group'"/>        
      <Takuchii message="I didn't find any invites!" emoji="(╥﹏╥)"        v-if="inviteChannels.length != 0 && searchString.length > 0 && searchInvites.length == 0 && view == 'invites'"/>        

      <div class="channels">
        <div v-if="view == 'private'">
          <Channel :channel="channel" v-for="channel in searchDMS" :key="channel"/>
        </div>
        <div v-if="view == 'group'">
          <Channel :channel="channel" v-for="channel in searchGroups" :key="channel"/>
        </div>
      </div>
    </div>

    <!-- <div class="bottomButtons" >
      <div class="button" :class="{active: isMakingNewGroup}">
        <div class="iconWrapper" @click="isMakingNewGroup = !isMakingNewGroup">
          <img src="../assets/newGroup.png" alt="New Group">
        </div>
        <input v-if="isMakingNewGroup" class="searchBox" @enter="makeNewGroup()" placeholder="Group name" v-model="newGroupName" type="text">
      </div>

      <div class="button deny" v-if="isMakingNewGroup" @click="isMakingNewGroup = !isMakingNewGroup; newGroupName = ''">
        <div class="iconWrapper">
          <img src="../assets/deny.svg" alt="New Group">
        </div>
      </div>

      <div class="button accept" v-if="isMakingNewGroup" @click="makeNewGroup()">
        <div class="iconWrapper">
          <img src="../assets/checkmark.svg" alt="New Group">
        </div>
      </div>

    </div> -->
  </div>
</template>

<script>

import Channel from '@/components/v2/Channel.vue'; 
import Takuchii from '@/components/v2/Takuchii.vue'; 

export default {
  name: 'Channels',
  data: () => {
    return {
      searchDMS: [],
      searchGroups: [],
      searchInvites: [],
      searchString: '',
    };
  },
  components: {
    Channel,
    Takuchii,
  },
  props: {
    view:            { type: String, required: true},
    privateChannels: { type: Array, required: true },
    groupChannels:   { type: Array, required: true },
    inviteChannels:  { type: Array, required: true }
  }, 
  mounted() {
    this.filterSearch();
  },
  methods: {
    filterSearch() {
      // Reset arrays to empty
      this.searchDMS = [];
      this.searchGroups = [];
      this.searchInvites = [];
      // If search results are empty, make them identical to all results
      if (this.searchString.length == 0) {
        this.searchDMS = this.privateChannels;
        this.searchGroups = this.groupChannels;
        this.searchInvites = this.inviteChannels;
        return
      }

      // If the string is found in any dm persons username, it is added to search results
      this.privateChannels.forEach(dm => {
        if(dm.member_list[0].username.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchDMS.push(dm);
      });
      // If the string is found in any group name, it is added to search results
      this.groupChannels.forEach(group => {
        if(group.name.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchGroups.push(group);
      });
      // If the string is found in any invite group name, it is added to search results
      this.inviteChannels.forEach(group => {
        if(group.name.toLowerCase().includes(this.searchString.toLowerCase()))
          this.searchInvites.push(group);
      });
    }
  }
}
</script>
 scoped
.channelsContainer {
  background: var(--dark);
  width: 320px;
  min-width: 320px;
  color: var(--textDark);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.searchBox {
  outline: none;
  border: none;
  text-indent: 8px;
  height: 100%;
  width: 100%;
  background: transparent;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  z-index: 3px;
  color: white; 
}

.searchBox::placeholder { 
  color: var(--textDark); 
}

.call {
  height: 80px;
  width: 100%;
  padding: 16px;
  background: #7FE876;
}

.search { 
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
} 

.search h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  color: inherit;
}

.search img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.searchBox {
    display: flex;
    position: relative;
    align-items: center;
}

.searchField::placeholder {
    letter-spacing: 1px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 700;
    opacity: 1;
}

.searchField:focus {
    outline: none;
}

.searchField.img {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-left: 12px;
    margin-top: 10px;
}

.searchField {
    width: 100%;
    max-width: 600px;
    min-width: 16px;
    height: 39px;
    background: rgba(65, 63, 87, 0.25);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding-left: 24px;
    margin-right: 14px;
}

menu.view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
}

menu.view div {
  width: 100%;
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

section {
  padding: 0px 8px;
  width: 100%;
  height: 32px;
  gap: 8px;
  display: flex;
  align-items: center;
  text-align: center;
}

menu.view div, section h1 {
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 117.9%;
}

.channels {
  display: flex;
  gap: 8px;
  flex-direction: column;
} 
<style>

</style>