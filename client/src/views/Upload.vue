<template>
  <div class="formContainer">
    <form action="" v-on:submit.prevent="onSubmit">
      
      <label for="wallpaper">wallpaper</label>
      <input type="file" name="" id="wallpaper" ref="wallpaper" v-on:change="wallpaper = $refs.wallpaper.files[0]" accept="image/*">

      <label for="anime_uuid">anime_uuid</label>
      <input placeholder="e.g. bbbd0f14-e433-46f7-a713-1a73db5bc9f7" type="text" name="" id="anime_uuid" v-model="form.anime_uuid">

      <label for="season">season</label>
      <input placeholder="e.g. 1" type="number" name="" id="season" v-model="form.season">

      <label for="episode">episode</label>
      <input placeholder="e.g. 3" type="number" name="" id="episode" v-model="form.episode">

      <label for="timestamp">timestamp</label>
      <input placeholder="e.g. hh:mm:ss" type="string" name="" id="timestamp" v-model="form.timestamp">

      <label for="isNsfw">isNsfw</label>
      <input type="checkbox" name="" id="isNsfw" v-model="form.isNsfw">

      <label for="tags">tags (seperated by spaces)</label>
      <input placeholder="e.g. #sky #moon #clouds" type="text" name="" id="tags" v-model="form.tags">

      <br>
      <br>

      <button>Submit</button>

      <br>
      <br>

      <label for="file">Upload progress:</label>
      <progress id="file" :value="uploadValue" :max="uploadMax"> {{uploadValue}}</progress>

    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data: () => {
        return {
          form: {
            submitter: {},
            anime_uuid: '',
            season: '',
            episode: '',
            timestamp: '',
            isNsfw: false,
            tags: '',
          },
          wallpaper: {},
          uploadValue: 0,
          uploadMax: 0,
        }
    },
    methods: {
        async onSubmit () {

            console.log(this.form);

            // if (Object.values(this.form).some(field => field == '')) return console.log("form incomplete");
            if (this.wallpaper == undefined) return console.log("wallpaper missing");

            // remove hashtags from colors
            this.form.tags = this.form.tags.split(" ").map(tag => tag.replace("#", ""));

            let formData = new FormData();

            // Main Images
            formData.append('metadata', JSON.stringify(this.form));
            formData.append('files',    this.wallpaper);

            this.uploadMax = this.wallpaper.size;

            const response = await axios.post('https://taku.moe:2087/wallpapers/', formData, {
              onUploadProgress: progressEvent => {
                this.uploadValue = progressEvent.loaded;
                this.uploadMax = progressEvent.total;
                console.log(progressEvent);
              },
              withCredentials: true,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            // Clear the form if submitted
            if(!response.data.error) {
              this.form = {
                submitter: {},
                anime_uuid: '',
                season: '',
                episode: '',
                timestamp: '',
                isNsfw: false,
                tags: '',
              };
              this.wallpaper = {};
              this.uploadValue = 0;
              this.uploadMax = 0;
            };

            // Show message and return back to form
            console.log(response.data);
        }
    }
}
</script>

<style scoped>

.formContainer {
  padding: 128px 128px;
}

form {
  width: 512px;
  display: flex;
  flex-direction: column;
}

</style>