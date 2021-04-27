<template>
  <div class="channelsContainer" v-if="privateChannels && settings.messages.isChannellistVisible" :class="{darkmode: darkmode == 'true'}">
    <div class="top" >
      <div v-if="callState != 'idle'" class="call">
        {{callInformation.username}} {{translation('Is calling you!')}}
      </div>

      <div v-if="me.isCalling" class="call">
        {{translation('Calling')}} {{userToCall.username}}...
      </div>

      <div class="search">
        <div class="button">
          <input ref="search" class="searchBox" spellcheck="false" placeholder="Search users and channels" v-model="searchString" type="text" @keyup="filterSearch()">
          <div class="iconWrapper">
            <img src="../assets/search.svg" alt="Search">
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
        <div @click="isShowingSortMenu = true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.77349 9.59869C6.79149 9.61469 6.80849 9.62969 6.82549 9.64769C7.90449 10.7537 8.49949 12.2187 8.49949 13.7737V17.7577L10.7355 16.5397C10.9115 16.4437 11.0205 16.2557 11.0205 16.0487V13.7617C11.0205 12.2127 11.6095 10.7527 12.6785 9.65269L17.5155 4.50769C17.8285 4.17469 18.0005 3.73769 18.0005 3.27669V2.34069C18.0005 1.87669 17.6345 1.49969 17.1865 1.49969H2.31549C1.86649 1.49969 1.50049 1.87669 1.50049 2.34069V3.27669C1.50049 3.73769 1.67249 4.17469 1.98549 4.50669L6.77349 9.59869ZM8.14649 19.5007C7.94449 19.5007 7.74449 19.4467 7.56249 19.3387C7.21049 19.1287 6.99949 18.7577 6.99949 18.3457V13.7737C6.99949 12.6387 6.57649 11.5697 5.80549 10.7507C5.78249 10.7317 5.75949 10.7107 5.73949 10.6887L0.893488 5.53569C0.317488 4.92369 0.000488281 4.12069 0.000488281 3.27669V2.34069C0.000488281 1.04969 1.03949 -0.000305176 2.31549 -0.000305176H17.1865C18.4615 -0.000305176 19.5005 1.04969 19.5005 2.34069V3.27669C19.5005 4.11969 19.1835 4.92169 18.6095 5.53469L13.7625 10.6887C12.9595 11.5167 12.5205 12.6057 12.5205 13.7617V16.0487C12.5205 16.8047 12.1115 17.4967 11.4535 17.8567L8.69249 19.3607C8.52049 19.4537 8.33349 19.5007 8.14649 19.5007Z" fill="#676E78"/></svg>
          <SortingMenu v-if="isShowingSortMenu" @mouseleave="isShowingSortMenu = false"/>
        </div>
      </menu>

      <section v-if="pinnedChannels.some(channel => channel.isPinned == true)">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0415 12.9838C10.0848 13.0087 10.1314 13.0268 10.1796 13.0378L10.1657 13.1021L10.2919 13.1C10.5503 13.0956 10.7737 12.916 10.831 12.6629C10.8923 12.411 10.7768 12.1491 10.5494 12.0249L10.5481 12.0242L7.46984 10.4014C7.17107 10.234 6.80665 10.2341 6.50793 10.4016L3.97428 11.7601L4.46828 8.84543C4.46828 8.84542 4.46828 8.84541 4.46829 8.84541C4.52526 8.50962 4.41731 8.16703 4.17673 7.92508C4.17666 7.92501 4.17659 7.92494 4.17652 7.92487L2.12804 5.84511L4.96085 5.41498L4.96085 5.41498L4.9618 5.41483C5.30266 5.3597 5.59192 5.13486 5.72884 4.81763L7.0063 2.16115L8.2667 4.77333C8.40359 5.08981 8.69276 5.31529 9.03369 5.37044L9.03434 5.37054L11.8775 5.81146L9.81283 7.89562L9.8125 7.89595C9.57144 8.14156 9.46367 8.48825 9.52121 8.82742L9.5212 8.82743L9.52148 8.82894L9.83285 10.5075C9.83287 10.5076 9.83288 10.5077 9.8329 10.5078C9.88718 10.8098 10.1755 11.0102 10.4771 10.9561L10.4779 10.9559C10.7833 10.8984 10.9847 10.6064 10.9331 10.301L10.9331 10.301L10.9329 10.2998L10.6362 8.67201L12.7965 6.50132L12.7965 6.50134L12.7979 6.49989C13.156 6.12538 13.201 5.55065 12.9049 5.12521L12.9042 5.12431C12.7446 4.90019 12.5004 4.74976 12.228 4.7091C12.2279 4.70909 12.2279 4.70908 12.2278 4.70907L9.24357 4.25216L7.91466 1.48742C7.81404 1.26878 7.63834 1.09257 7.41864 0.992078C6.91203 0.75988 6.31359 0.981909 6.08084 1.48742L4.75794 4.2425L1.78434 4.694C1.56058 4.7248 1.3542 4.83068 1.19838 4.99429C0.800473 5.4056 0.800491 6.05852 1.19873 6.4692L1.19872 6.4692L1.19938 6.46987L3.37071 8.66754L2.85114 11.733L2.85096 11.7341C2.81529 11.96 2.8516 12.1906 2.95527 12.3947M10.0415 12.9838L4.33871 12.8222L4.29107 12.7342L4.33847 12.8223L4.33848 12.8223C3.84726 13.0883 3.23239 12.9061 2.96589 12.4146C2.96306 12.4095 2.95921 12.4026 2.95527 12.3947M10.0415 12.9838L7.00667 11.3861M10.0415 12.9838L7.00667 11.3861M2.95527 12.3947C2.95522 12.3946 2.95517 12.3945 2.95512 12.3944L3.04456 12.3497L2.95542 12.395C2.95537 12.3949 2.95532 12.3948 2.95527 12.3947ZM7.00667 11.3861L7.05355 11.3609L7.00615 11.2728M7.00667 11.3861L7.00615 11.2728M7.00667 11.3861L6.95957 11.3613L7.00615 11.2728M7.00667 11.3861L7.00615 11.2728" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>PINNED</h1>
      </section> 

      <div v-if="pinnedChannels.some(channel => channel.isPinned == true)" class="channelsWrapper">
        <div class="channels" v-if="view == 'private'">
          <Channel :channel="channel" v-for="channel in pinnedChannels" :key="channel"/>
        </div>
      </div>

      <section v-if="privateChannels.length != 0 && view == 'private'">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.75137 13.1617C4.74169 13.4819 4.99473 13.7483 5.31526 13.7566C5.53968 13.7633 5.7681 13.7666 5.99983 13.7666C7.14532 13.7666 8.49248 13.7035 9.5558 13.3608C10.0881 13.1891 10.557 12.9451 10.8937 12.5968C11.2328 12.2461 11.4332 11.7942 11.4332 11.22C11.4332 10.6111 11.1977 10.1423 10.8213 9.78593C10.4477 9.4323 9.9383 9.19205 9.39026 9.0276C8.29467 8.69883 7.01196 8.66377 6.25424 8.65991L6.25377 8.65991L5.85878 8.65977L5.85826 8.65977C4.72154 8.66519 3.40943 8.73949 2.37886 9.08685C1.86289 9.26076 1.41006 9.5055 1.08547 9.85103C0.758645 10.1989 0.566504 10.6443 0.566504 11.2067C0.566504 11.5508 0.647171 11.958 0.921625 12.3438C1.19613 12.7297 1.65821 13.0852 2.40542 13.3367C2.71121 13.4413 3.03978 13.2759 3.1433 12.9745L3.14338 12.9743C3.2466 12.6714 3.08299 12.3434 2.77876 12.2412C2.28909 12.0763 2.02979 11.8838 1.89194 11.705C1.7558 11.5285 1.72986 11.3548 1.72986 11.2067C1.72986 10.7779 2.04342 10.4299 2.75982 10.1856C3.47403 9.94213 4.55325 9.81675 5.99983 9.81675C7.44638 9.81675 8.52549 9.94329 9.23959 10.189C9.95551 10.4353 10.2698 10.7864 10.2698 11.22C10.2698 11.6484 9.95632 11.9962 9.23988 12.2402C8.52565 12.4835 7.44642 12.6087 5.99983 12.6087C5.77925 12.6087 5.56216 12.606 5.34854 12.6L5.34854 12.6L5.34497 12.6C5.03988 12.6024 4.7605 12.8379 4.75137 13.1617ZM4.75137 13.1617C4.75137 13.1618 4.75136 13.1618 4.75136 13.1619L4.85132 13.1647L4.75137 13.1616C4.75137 13.1617 4.75137 13.1617 4.75137 13.1617ZM9.69094 3.90256C9.69094 1.87881 8.03487 0.233313 5.99983 0.233313C3.96482 0.233313 2.30805 1.87879 2.30805 3.90256C2.30805 5.92567 3.96484 7.57114 5.99983 7.57114C8.03486 7.57114 9.69094 5.92565 9.69094 3.90256ZM3.47208 3.90256C3.47208 2.51841 4.60541 1.39129 5.99983 1.39129C7.39426 1.39129 8.52759 2.51841 8.52759 3.90256C8.52759 5.28602 7.39427 6.41316 5.99983 6.41316C4.6054 6.41316 3.47208 5.28602 3.47208 3.90256Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>USERS</h1>
      </section>
      <section v-if="groupChannels.length != 0 && view == 'group'">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.26495 7.41793C9.64089 7.42636 12.4932 7.55556 12.4932 9.53674C12.4932 11.5277 9.53817 11.6576 8.24485 11.6661L7.99999 11.6666C7.7452 11.6666 7.53842 11.4587 7.53842 11.2025C7.53842 10.9464 7.7452 10.7384 7.99999 10.7384C9.62842 10.7384 11.5701 10.5299 11.5701 9.53674C11.5701 8.74591 10.3694 8.34554 7.99999 8.34554C6.37156 8.34554 4.42989 8.55408 4.42989 9.54787C4.42989 9.7694 4.49451 10.0547 4.99854 10.3028C5.20533 10.4049 5.4675 10.4903 5.77644 10.5565C6.02569 10.6097 6.18509 10.8566 6.13155 11.1073C6.07862 11.3579 5.83245 11.52 5.58443 11.4643C5.20163 11.382 4.86807 11.2719 4.59236 11.137C3.69506 10.6945 3.50674 10.0287 3.50674 9.54787C3.50674 7.55629 6.46181 7.4264 7.75513 7.41793L8.26495 7.41793ZM12.7128 6.99848C13.0544 7.02137 13.3978 7.0715 13.7351 7.14637C14.4865 7.29612 14.9819 7.60366 15.1979 8.05848C15.3782 8.43904 15.3782 8.87468 15.1979 9.25524C14.9844 9.70635 14.4902 10.0151 13.7277 10.1729C13.6969 10.1797 13.6655 10.1828 13.6341 10.1828C13.42 10.1828 13.2279 10.0312 13.183 9.81216C13.1319 9.56093 13.2926 9.31527 13.5424 9.26391C14.172 9.13334 14.3271 8.93532 14.3646 8.85612C14.4243 8.72988 14.4243 8.58446 14.3646 8.45823C14.2859 8.29177 13.98 8.1414 13.5455 8.05477C13.2433 7.98794 12.9455 7.944 12.6513 7.9242C12.3965 7.90749 12.2045 7.68535 12.2217 7.42978C12.2383 7.17422 12.4605 6.98486 12.7128 6.99848ZM3.29177 6.98895C3.53794 6.96976 3.76627 7.16469 3.7835 7.42025C3.80073 7.67643 3.60872 7.89796 3.35393 7.91467C3.05729 7.93447 2.75943 7.97841 2.46833 8.044C2.02153 8.13249 1.71443 8.28348 1.63504 8.45055C1.57534 8.57741 1.57534 8.72406 1.63504 8.85092C1.67319 8.93074 1.82828 9.12938 2.46033 9.25995C2.71019 9.31131 2.87082 9.55635 2.81974 9.80758C2.77543 10.0273 2.5828 10.1782 2.36801 10.1782C2.33724 10.1782 2.30647 10.1752 2.27508 10.169C1.51133 10.0118 1.01591 9.70239 0.801744 9.24943C0.621424 8.86886 0.621424 8.43261 0.801744 8.05205C1.01838 7.59475 1.51503 7.28597 2.27816 7.13498C2.60372 7.06197 2.94898 7.01184 3.29177 6.98895ZM8.00018 0.333313C9.67907 0.333313 11.0453 1.70643 11.0453 3.39514C11.0453 5.08385 9.67907 6.45696 8.00018 6.45696C7.31274 6.45696 6.66469 6.23481 6.12681 5.81403C5.92556 5.65686 5.88925 5.3654 6.04557 5.16305C6.20128 4.96009 6.49237 4.92419 6.69362 5.08199C7.0678 5.37406 7.51952 5.52876 8.00018 5.52876C9.17072 5.52876 10.1222 4.57148 10.1222 3.39514C10.1222 2.2188 9.17072 1.26151 8.00018 1.26151C6.82963 1.26151 5.87756 2.2188 5.87756 3.39514C5.87756 3.65132 5.67078 3.85924 5.41599 3.85924C5.1612 3.85924 4.95442 3.65132 4.95442 3.39514C4.95442 1.70643 6.32067 0.333313 8.00018 0.333313ZM11.7887 0.967336C13.1143 0.967336 14.1932 2.05147 14.1932 3.38499C14.1932 4.71789 13.1143 5.80264 11.7887 5.80264C11.5339 5.80264 11.3271 5.59473 11.3271 5.33854C11.3271 5.08236 11.5339 4.87444 11.7887 4.87444C12.6054 4.87444 13.27 4.20614 13.27 3.38499C13.27 2.56384 12.6054 1.89554 11.7887 1.89554C11.5339 1.89554 11.3271 1.68762 11.3271 1.43144C11.3271 1.17463 11.5339 0.967336 11.7887 0.967336ZM4.21873 0.941718C4.47352 0.941718 4.6803 1.14963 4.6803 1.40582C4.6803 1.662 4.47352 1.86992 4.21873 1.86992C3.39898 1.86992 2.73185 2.5407 2.73185 3.36494C2.73185 4.18918 3.39898 4.85934 4.21873 4.85934C4.47352 4.85934 4.6803 5.06726 4.6803 5.32345C4.6803 5.57963 4.47352 5.78755 4.21873 5.78755C2.89002 5.78755 1.80871 4.70093 1.80871 3.36494C1.80871 2.02895 2.89002 0.941718 4.21873 0.941718Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>GROUPS</h1>
      </section>
      <section v-if="inviteChannels.length != 0 && view == 'invites'">
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.0998 5.06717V5.06713L15.0992 3.33784C15.0992 3.33782 15.0992 3.33781 15.0992 3.3378C15.0991 1.80897 13.8428 0.566504 12.3005 0.566504H3.36584C1.82358 0.566504 0.567191 1.80897 0.567171 3.3378C0.567171 3.33781 0.567171 3.33782 0.567171 3.33784L0.566504 5.12313V5.12317C0.566504 5.28144 0.629529 5.43496 0.742481 5.54724C0.854702 5.66011 1.00752 5.72317 1.1665 5.72317C1.66107 5.72317 2.01784 6.06321 2.01784 6.5005C2.01784 6.95816 1.63775 7.33384 1.1665 7.33384C0.835275 7.33384 0.566504 7.60261 0.566504 7.93384V9.66184C0.566504 11.1907 1.8229 12.4332 3.36517 12.4332H12.3012C13.8434 12.4332 15.0998 11.1907 15.0998 9.66184V7.93384C15.0998 7.60261 14.8311 7.33384 14.4998 7.33384C14.0286 7.33384 13.6485 6.95816 13.6485 6.5005C13.6485 6.04285 14.0286 5.66717 14.4998 5.66717C14.6588 5.66717 14.8117 5.6041 14.9239 5.49121C15.0368 5.37894 15.0998 5.22543 15.0998 5.06717ZM9.66587 1.7665H12.3005C13.1835 1.7665 13.8992 2.47325 13.8992 3.33784V3.33789L13.8998 4.55625C13.061 4.81096 12.4485 5.58487 12.4485 6.5005C12.4485 7.4155 13.0616 8.19001 13.8998 8.44475V9.66184C13.8998 10.5264 13.1841 11.2332 12.3012 11.2332H9.66588L9.66624 10.3409V10.3408C9.66624 10.0089 9.39738 9.74084 9.06624 9.74084C8.73511 9.74084 8.46626 10.0088 8.46624 10.3408C8.46624 10.3408 8.46624 10.3408 8.46624 10.3408L8.46588 11.2332H3.36517C2.48221 11.2332 1.7665 10.5264 1.7665 9.66184V8.44475C2.6047 8.19001 3.21784 7.4155 3.21784 6.5005C3.21784 5.59282 2.6136 4.84788 1.76654 4.60626L1.76717 3.33789V3.33784C1.76717 2.47325 2.48287 1.7665 3.36584 1.7665H8.46587L8.46624 2.9473C8.46624 2.94731 8.46624 2.94732 8.46624 2.94734C8.46625 3.27855 8.73502 3.5473 9.06624 3.5473C9.39746 3.5473 9.66624 3.27853 9.66624 2.9473V2.94727L9.66587 1.7665ZM9.66624 4.83617C9.66624 4.50494 9.39746 4.23617 9.06624 4.23617C8.73501 4.23617 8.46624 4.50494 8.46624 4.83617V8.05017C8.46624 8.3814 8.73501 8.65017 9.06624 8.65017C9.39746 8.65017 9.66624 8.3814 9.66624 8.05017V4.83617Z" fill="#6D6E72" stroke="#6D6E72" stroke-width="0.2"/></svg><h1>INVITES</h1>
      </section>

      <Takuchii message="You don't have any dms!" emoji="(｡•́︿•̀｡)"         v-if="privateChannels.length == 0 && view == 'private'"/>
      <Takuchii message="You don't have any group chats!" emoji="(｡•́︿•̀｡)" v-if="groupChannels.length == 0 && view == 'group'"/>  
      <Takuchii message="You don't have any invites!" emoji="(｡•́︿•̀｡)"     v-if="inviteChannels.length == 0 && view == 'invites'"/>  
      <Takuchii message="I didn't find anyone!" emoji="｡･ﾟﾟ*(>д&lt;)*ﾟﾟ･｡"    v-if="privateChannels.length != 0 && searchString.length > 0 && searchDMS.length == 0 && view == 'private'"/>  
      <Takuchii message="I didn't find any groups!" emoji="(╥﹏╥)"         v-if="groupChannels.length != 0 && searchString.length > 0 && searchGroups.length == 0 && view == 'group'"/>        
      <Takuchii message="I didn't find any invites!" emoji="(╥﹏╥)"        v-if="inviteChannels.length != 0 && searchString.length > 0 && searchInvites.length == 0 && view == 'invites'"/>        

      <div class="channelsWrapper">
        <div class="channels" v-if="view == 'private'">
          <Channel :channel="channel" v-for="channel in searchDMS" :key="channel"/>
        </div>
        <div class="channels" v-if="view == 'group'">
          <Channel :channel="channel" v-for="channel in searchGroups" :key="channel"/>
        </div>
      </div>

    </div>

    <div class="bottomButtons"> 
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

    </div>
  </div>
  <div id="video-grid"></div>
  <Chat v-if="showChat"/>
</template>
 
<script>
import linkifyHtml from 'linkifyjs/html';
import socket from '@/services/socket.js';
import peer from '@/services/peerjs.js';
import translation from '@/services/translator.js';

// Components
import Chat from '@/components/Chat.vue';
import Channel from '@/components/v2/Channel.vue'; 
import Takuchii from '@/components/v2/Takuchii.vue'; 
import SortingMenu from '@/components/v2/SortingMenu.vue'; 

export default {
  name: 'home',
  components: {
    Chat,
    Channel,
    Takuchii,
    SortingMenu,
  },
  data: () => {
    return {
      isShowingSortMenu: false,
      me: JSON.parse(localStorage.me),
      settings: JSON.parse(localStorage.settings),
      dms: [],
      channels: [],
      privateChannels: [],
      pinnedChannels: [],
      groupChannels: [],
      inviteChannels: [],
      searchDMS: [],
      searchGroups: [],
      searchInvites: [],
      searchString: '',
      view: 'private',
      darkmode: localStorage.darkmode,
      isMakingNewGroup: false,
      newGroupName: "",
      callState: 'idle',
      showChat: true,
      callInformation: null,
      userToCall: null,
    };
  },
  mounted() {
    this.loadCache();
    this.getChannels();
    this.emitter.on("call", (participants) => this.call(participants));
    this.emitter.on('updateUI', () => this.updateUI()); 
    this.emitter.on('pin', channel => this.pin(channel));
    this.emitter.on('unpin', channel => this.unpin(channel));
    this.emitter.on('resortChannels', sortType => this.sort(sortType));

    socket.on('call', callInformation => {
      this.callState = 'beingCalled';
      this.callInformation = callInformation;
    });
  },
  methods: {   
    translation,
    pin(channel){
      this.api.channels.pin(channel.uuid);
      channel.isPinned = true;

      this.privateChannels.splice(this.privateChannels.indexOf(channel), 1);
      if (!this.pinnedChannels.includes(channel)) this.pinnedChannels.push(channel);
    },
    unpin(channel){ 
      this.api.channels.unpin(channel.uuid);
      channel.isPinned = false;

      this.pinnedChannels.splice(this.pinnedChannels.indexOf(channel), 1);
      if (!this.privateChannels.includes(channel)) this.privateChannels.unshift(channel);
    },
    updateUI(){
      this.darkmode = localStorage.darkmode;
      this.settings = JSON.parse(localStorage.settings);
    },
    async call(participants){
      if(this.me.isCalling || this.callState == 'inCall' || this.callState == 'calling' || this.callState == 'beingCalled') return console.log(`Cannot initialize call in this state!`);
      else console.log(`Call would be initialized now`);

      this.me.isCalling = true;
      this.userToCall = participants[0];
      this.callState = 'inCall';
      this.showChat = false;
      const videoGrid = document.getElementById('video-grid');

      // Make a new peer connection
      var peer = new Peer(this.me.uuid, {
        config: {'iceServers': [
          {urls:'stun:stun3.l.google.com:19302'},
          // {url:'stun:stun4.l.google.com:19302'},
          // {url: 'turn:turn.bistri.com:80',credential: 'homeo',username: 'homeo'},
          {urls: 'turn:turn.anyfirewall.com:443?transport=tcp',credential: 'webrtc',username: 'webrtc'}
        ]},
        secure: true,
        host: 'rtc.taku.moe',
        port: '8443'
      }); 

      const myvideo = document.createElement('video');
      myvideo.className = 'videoStream';
      // Mutes monitor feedback
      myvideo.muted = true;
      myvideo.controls = true;

      const peers = {}
      // Create new data stream containing the video data
      const stream = await navigator.mediaDevices.getUserMedia({audio: {
        echoCancellation: false,
        autoGainControl: true,
        noiseCancellation: true,
        channelCount: {max: 2, min: 1},
      }, video: true});
      addvideoStream(myvideo, stream);

      peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        video.className = 'videoStream';
        video.controls = true;
        call.on('stream', stream => addvideoStream(video, stream));
      });

      socket.on('user_connected', user_uuid => {
        console.log("user_connected", user_uuid);
        connectToNewUser(user_uuid, stream);
      });

      socket.on('user_disconnected', user_uuid => {
        console.log("disconnected", user_uuid);
        if (peers[user_uuid]) peers[user_uuid].close()
      })

      // When the peer is ready send an event on the socket that tells everyone else
      // That I joined the call with my user uuid being peer_uuid
      // peer.on('open', peer_uuid => {
      // });
      socket.emit('join_vc_channel', this.$route.params.channel_uuid, this.me.uuid);

      // Connects to new user
      function connectToNewUser(user_uuid, stream){
        var call = peer.call(user_uuid, stream);
        const video = document.createElement('video');
        video.className = 'videoStream';
        video.controls = true;
        call.on('stream', function(stream) { addvideoStream(video, stream)});
        call.on('close', () => video.remove());
        peers[user_uuid] = call;
      };

      function addvideoStream(video, stream){
        video.srcObject = stream;
        video.onloadedmetadata = event => video.play();
        videoGrid.append(video);
        console.log("Video grid added!");
      }

    },
    async makeNewGroup(){
      this.isMakingNewGroup = false;

      const body = {
        name: this.newGroupName,
      };

      this.newGroupName = "";

      const response = await this.api.channels.createGroup(body)

      if (response.status == 201) {
        console.log(response.data);
        this.view = 'group';
        this.groupChannels.push(response.data.channel);
        this.filterSearch();
        this.$router.push({ path: `/messages/group/${response.data.channel.uuid}` })
      }
    },
    async deleteChannel(channel){
      const response = await this.api.channels.deleteGroup(channel.uuid)
    },
    // Filter users/groups to searchIndex
    sort(sortType){
      console.log(sortType); 
      console.log(this.searchDMS);
      // Sort arrays to the way user wants, if no config is set, defaults to newest
      switch(sortType) {
        case 'alpha_asc':
          if(this.searchDMS.length > 1)
            this.searchDMS.sort(   (a, b) => (a.member_list[0].username.toLowerCase() > b.member_list[0].username.toLowerCase()) ? 1 : -1);
          // if(this.searchGroups.length > 1)
          //   this.searchGroups.sort((a, b) => (a.member_list[0].username > b.member_list[0].username) ? 1 : -1);
          // this.inviteChannels.sort((a, b) => (a - b));
        break;
        case 'alpha_desc':
          if(this.searchDMS.length > 1)
            this.searchDMS.sort(   (a, b) => (b.member_list[0].username.toLowerCase() > a.member_list[0].username.toLowerCase()) ? 1 : -1); 
          // if(this.searchGroups.length > 1)
          //   this.searchGroups.sort((a, b) => (b.member_list[0].username > a.member_list[0].username) ? 1 : -1);
          // this.inviteChannels.sort((a, b) => (b + a));
        break;
        // Todo: make checker, which checks if last_message exists
        case 'oldest':
          //this.searchDMS.sort((a, b) => (a.last_message.created_at > b.last_message.created_at) ? 1 : -1);
        break;
        default:
          //this.searchDMS.sort((a, b) => (b.last_message.created_at > a.last_message.created_at) ? 1 : -1);
        break;
      }
    },
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
        this.sort(localStorage.sortType);
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

      this.sort(localStorage.sortType);
    },

    // Fetches right translation of the site
    translation(sentence){
        if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
        else this.languageTable = require(`@/languages/${localStorage.language}.json`);
        let translatedSentence = this.languageTable[sentence];
        if (!translatedSentence) return sentence;
        return translatedSentence;
    },

    // Loads from local storage
    loadCache(){
      const channels = Object.values(this.cache.getChannels());

      if (channels.length == 0 || channels == null) return;

      this.channels = channels;
      this.privateChannels = channels.filter(channel => channel.type == 'dm');
      this.groupChannels = channels.filter(channel => channel.type == 'group');
      // This runs so fucking fast in here
      // Auto update the URL if theres no channel 
      // E.g. if tthe url is https://taku.moe/messages/
      // This will redirect it to the first private channel they have
      if (this.$route.params.channel_uuid == '' && this.privateChannels != null){
        this.$router.push(`/messages/private/${this.privateChannels[0].uuid}`);
      }

      this.filterSearch();
    },

    // Return list of channels this user is in
    async getChannels(){
      try {
        var channelsRequest = await this.api.channels.getChannels();
        var invitesRequest = await this.api.channels.getInvites();
      } catch (error) {
        if (error.status == 401) {
          localStorage.clear();
          window.location.href = `${this.rootPath}/login`;
          return
        }
      }

      if(typeof this.channels !== 'array') this.channels = [];

      // Reset this to simply avoid having dupes when merging with cache
      this.privateChannels = [];
      this.groupChannels = [];

      for (let channel of channelsRequest.data.channels){
        //console.log(channel); 
        let member_list = [];

        for (let member of channel.member_list){
          if (member.uuid != this.me.uuid) member_list.push(member);
        }
        
        channel.member_list = member_list;
        if (channel.isPinned) this.pinnedChannels.push(channel);
        
        this.channels.push(channel);
        this.cache.updateChannel(channel)

        if (channel.type == "dm" && !channel.isPinned) this.privateChannels.push(channel);
        if (channel.type == "group" && !channel.isPinned) this.groupChannels.push(channel);
      }

      this.inviteChannels = invitesRequest.data;
      this.filterSearch();
    }
  }
}

</script>

<style scoped>

#video-grid {
  top: 220px;
  right: 350px;
  display: grid;
  width: max-content;
  z-index: 400;
  align-content: center;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

#video-grid img {
  width: 128px;
  height: auto;
}

/* what happens when the animation is currently active */
.slide-fade-enter-active {
  transform: translateX(256px);
}

/* where it will end up when the entering animation is done */
.slide-fade-enter-to {
  transform: translateX(0px);
  transition: all .3s ease;
}

/* apply the transition to the exit animation only when its active so it doesn't snap */
.slide-fade-leave-active {
  transition: all .3s ease;
}

/* where the leaving animation finishes off */
.slide-fade-leave-to {
  transform: translateX(256px);
}

.shrink-enter-active {
  transform: scale(0.75);
}

.shrink-leave-active {
  transition: all .3s ease;
}

.shrink-enter-to {
  transform: scale(1);
  transition: all .3s ease;
}

.shrink-leave-to {
  transform: scale(0.75);
}

.bottomButtons {
  width: 100%;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 8px;
}

.button {
  cursor: pointer;
  width: fit-content;
  transition: 100ms ease;
  min-width: 48px;
  width: 100%;
  height: 32px;
  position: relative;
  background: var(--light);
  border: transparent 1px solid;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: 100ms ease;
}

.button.accept:hover {
  background: #9aff97;
}

.button.deny:hover {
  background: #ff9797;
}

.button.active {
  width: 100%;
}

.button:hover, .button.active {
  /* background: #F1F2F4; */
  border: var(--hoverOutline) 1px solid;
}

.button .iconWrapper {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.iconWrapper img {
  position: absolute;
  width: 24px;
  transform: translateX(12px);
  height: 24px;
  filter: invert(51%) sepia(1%) saturate(2032%) hue-rotate(191deg) brightness(81%) contrast(80%);
}

.deleteChannel {
  width: 24px;
  transform: translateX(12px);
  height: 24px;
  filter: invert(17%) sepia(66%) saturate(344%) hue-rotate(174deg) brightness(83%) contrast(84%);
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

.channelsWrapper {
  height: fit-content;
  overflow-y: visible
}

.channelsContainer {
  background: var(--dark);
  height: 100%;
  width: 320px;
  min-width: 320px;
  color: var(--textDark);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channelsContainer .top {
    display: flex;
    flex-direction: column;
    height: 100%;
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

section {
  padding: 0px 8px;
  width: 100%;
  height: 32px;
  min-height: 32px;
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
  gap: 4px;
  flex-direction: column;
} 



</style>