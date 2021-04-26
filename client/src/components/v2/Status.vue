<template>
    <div class="status">
        <!-- this is some sus code -->
        <div class="icon" :class="{
            online: curStatus == 'online', 
            offline: curStatus == 'offline', 
            small: size == 'small',
            big: size == 'big'}
            ">
        </div>
        <div class="text" v-if="showText" :style="{'font-size': textSize, 'color': textColor}">
            <p>{{statusText}}</p>
        </div>
    </div>
</template>

<script>
import translation from '@/services/translator.js';

export default {
    props: {
        profile:      { type: Object,   required: true },
        showText:     { type: Boolean,  required: false, default: false },
        showFullText: { type: Boolean,  required: false, default: false },
        textColor:    { type: String,   required: false, default: 'F1F2F4'},
        textSize:     { type: Number,   required: false, default: 10 },
        size:         { type: String,   required: false, default: 'small' },
    },
    computed: {
        curStatus: function() {
            if(parseInt(this.profile.status.lastSeen) > new Date().getTime() - 300000) {
                return 'online';
            } else {
                return 'offline';
            }
        },

        statusText: function() {
            if(this.curStatus == 'offline') {
                if(this.showFullText) {
                    return `${translation('last seen at')} ${new Date(this.profile.status.lastSeen).toLocaleString()}`;
                } else {
                    return 'Offline'
                }
            } else {
                return 'Online'
            }
        }
    },
    // mounted() {
    //     this.getStatus();
    // },
    methods: {
        translation,
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

.icon.big {
    transform: scale(1.3);
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
  color: #F1F2F4;
  margin: 0px 4px;
}

</style>