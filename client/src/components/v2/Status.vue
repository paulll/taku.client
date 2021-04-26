<template>
    <div class="status">
        <div class="icon" :class="curStatus">
        </div>
        <div class="text" v-if="showText">
            <p>bababooey</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        profile:    { type: Object,  required: true },
        showText:   { type: Boolean, required: false,    default: false},
    },
    data: () => {
        return {
            curStatus: 'offline',
        }
    },
    mounted() {
        this.getStatus();
    },
    methods: {
        getStatus() {
            if(parseInt(this.profile.status.lastSeen) > new Date().getTime() - 300000) {
                this.curStatus = 'online';
            } else {
                this.curStatus = 'offline';
            }
        }
    }
}
</script>

<style scoped>

.status {
  display: flex;
  flex-direction: row;
}

.status .icon {
  position: static;
  width: 16px;
  min-width: 18px;
  height: 10px;

  border: transparent 3px solid;
  box-sizing: border-box;
  border-radius: 56px;
}

.offline {
  border: #626262 3px solid !important;
}

.online {
  border: #7FE876 3px solid !important;
}

.text{
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0px 4px;
  max-width: 160px;
}

</style>