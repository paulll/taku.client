<template>
    <div class="optionBox" >
        <div class="top">
            <div class="heading">
                <a href="https://osu.ppy.sh/oauth/authorize?client_id=5478&response_type=code&redirect_uri=http://localhost/settings/connections"><img src="@/assets/platforms/osu.png"></a>
                <img src="@/assets/platforms/discord.png">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    // These are the props that need (or may not need) to be passed down from the parent
    props: {
        user:         { type: Object,     required: true    },                    // User object
        darkmode:     { type: String,     required: false   },                    // Darkmode enabled or not
    },
    created(){
        this.themeColors = {
            '--themeColor': this.user.settings.appearance.theme_color,
            '--themeColorHover': `${this.user.settings.appearance.theme_color}66`,
        }
    },
}

</script>

<style scoped>


.optionBox {
  background: white;
  padding: 12px;
  border-radius: 8px;
  margin: 8px;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.11));
}

.optionBox.darkmode { /* darkmode */
  background: #10121D;
  color: white;
} 

.optionBox.darkmode .bottom, .optionBox.darkmode .textField                 { background: #171A28; }  /* darkmode */
.optionBox.darkmode .bottom a:not(:hover), .optionBox.darkmode .textField   { color: white; }         /* darkmode */
.optionBox.darkmode .bottom img:not(:hover)                                 { filter: invert(1); }      /* darkmode */

.heading {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(8, 1fr);
  align-items: center;
  justify-content: space-between;
}

.heading a {
  width: 48px;
  height: 48px;
}

.heading img {
  width: 40px;
  height: 40px;
  background: #F3F3F3;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  transition: 100ms ease;
}

.optionBox.darkmode .top .heading img {
  background: #171A28;
}

.heading img:hover {
  transform: scale(1.04);
}



</style>
