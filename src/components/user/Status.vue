<template>
  <!-- <div :class="status" class=" box-border w-4 h-2.5 border-3px rounded-4px"></div> -->
  <Icon :icon="device" :class="status"/>
</template>

<script setup lang="ts">
import { DeviceTypes, StatusTypes } from "../../services/types";
import Icon from "../misc/Icon.vue";
defineProps<{ status: StatusTypes, device: DeviceTypes }>();
</script>

<style>

.offline {
  filter: invert(52%) sepia(18%) saturate(0%) hue-rotate(144deg) brightness(84%) contrast(99%);
}

.online {
  filter: invert(87%) sepia(85%) saturate(6985%) hue-rotate(47deg) brightness(111%) contrast(101%);
}

.away {
  filter: invert(65%) sepia(74%) saturate(1379%) hue-rotate(359deg) brightness(102%) contrast(104%);
}

.dnd {
  filter: invert(10%) sepia(93%) saturate(5496%) hue-rotate(1deg) brightness(99%) contrast(114%);
}

</style>