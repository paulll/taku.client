<template>
  <header :style="{'background-image': `url(${bannerUrl});`}">
    <img :src="bannerUrl" alt="">
  </header>
</template>
 
<script>

export default {
  props: {
    bannerUrl: { type: String, required: true },
  },
  mounted(){
    console.log(this.bannerUrl);
  }
}

</script>

<style>
header {
  height: 80px;
  width: 100%;
  /* background: #ff006b; */
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 0;
  z-index: 101;
}

header img {
  width: 100%;
  object-fit: cover;
}

</style>