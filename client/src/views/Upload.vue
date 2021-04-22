<template>
  <div class="formContainer">
    <form action="" v-on:submit.prevent="onSubmit">

      <div>
        <label for="wallpaper">Wallpaper</label>
        <input class="fileUpload" type="file" name="" id="wallpaper" ref="wallpaper" v-on:change="wallpaper = $refs.wallpaper.files[0]" accept="image/*">
      </div>

      <div>
        <label for="anime_uuid">anime uuid</label>
        <input class="textField" placeholder="e.g. bbbd0f14-e433-46f7-a713-1a73db5bc9f7" type="text" name="" id="anime_uuid" v-model="form.anime_uuid">
      </div>

      <div>
        <label for="season">season</label>
        <input class="textField" placeholder="e.g. 1" type="number" name="" min="1" id="season" v-model="form.season">
      </div>

      <div>
        <label for="episode">episode</label>
        <input class="textField" placeholder="e.g. 3" type="number" name="" min="0" id="episode" v-model="form.episode">
      </div>

      <div>
        <label for="timestamp">timestamp</label>
        <input class="textField" placeholder="e.g. hh:mm:ss" type="string" name="" id="timestamp" v-model="form.timestamp">
      </div>

      <div>
        <label for="is_nsfw">nsfw</label>
        <input type="checkbox" name="" id="is_nsfw" v-model="form.is_nsfw">
      </div>

      <div>
        <label for="tags">tags (seperated by spaces)</label>
        <input class="textField" placeholder="e.g. #sky #moon #clouds" type="text" name="" id="tags" v-model="form.tags">
      </div>

      <br>
      <br>

      <div class="submit">
        <button>Submit</button>
      </div>      

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
            is_nsfw: false,
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

            const response = await axios.post(`${this.rootPath}:2087/wallpapers/`, formData, {
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
                is_nsfw: false,
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit button {
  border-radius: 16px;
  background: rgba(65, 63, 87, 0.25);
  outline: none;
  cursor: pointer;
  border: none;
  height: 44px;
  transition: 100ms ease;
}

.submit button:hover {
  background: rgb(255, 2, 171);
  transform: scale(1.02);
  color: white;
}

.submit button:active {
  transform: scale(0.92);
}

form {
  width: 512px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div {
  display: flex;
  flex-direction: column;
}

label {
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  color: #2C394A;
}

.textField {
  outline: none;
  border: none;
  width: 100%;
  text-indent: 16px;
  background: #F1F2F4;
  border-radius: 16px; 
  height: 44px;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.fileUpload {
  outline: none;
  border: none;
  width: 100%;
  text-indent: 16px;
  background: #F1F2F4;
  border-radius: 100px; 
  height: 44px;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

#file {
  width: 100%;
}

</style>