<template>
    <!-- <div @dragover.prevent @drop.prevent="handleFileDrop" @paste="handleFilePaste" class="dropArea"></div> -->
    <div class="sendMessageContainer">
        <form id="sendMessage" class="sendMessage" :class="{darkmode: darkmode == 'true'}" v-on:submit.prevent="sendMessage" >
            <input multiple id="file" class="formImageInput" type="file" ref="files" v-on:change="handleFileInput()">
            <div class="images" :class="{darkmode: darkmode == 'true'}">
                <img class="previewFile" v-for="file in previews" :src="file" :key="file" @click="deselect(previews.indexOf(file))" alt="">
            </div>
            <div class="inputFields">
                <img class="plusButton" src="@/assets/plus.svg" alt="" @click="$refs.files.click()">
                <input :class="{darkmode: darkmode == 'true'}" ref="message" type="text" name="chat" @keydown="typing()" id="chat" v-model="message" maxlength="4096" placeholder="Write something..." autocomplete="off">
                <div v-if="previews.length > 0" type="file" class="quickButton removeAll" @click.prevent="deselectAll()">{{translation('CLEAR')}}</div>
            </div>
        </form> 
        <button :class="{ready: message || previews.length > 0}" type="file" class="submit" form="sendMessage"><img :src="require(`@/assets/send.png`)" ></button>
    </div> 
</template>

<script>
export default {

    // These are the props that need (or may not need) to be passed down from the parent
    data: () => {
        return {
            darkmode: localStorage.darkmode,
            previews: [],
            attachments: [],
            message: '',
        };
    },
    methods: {
        sendMessage(){

          let attachments = this.attachments;
          if (this.message.trim().length == 0 && attachments.length == 0) return;

          // Make a JSON out of the thing
          let message = {
            content: this.message.trim(), 
            attachments: attachments,
          };

          this.emitter.emit("sendMessage", message);

          // Reset
          this.message = "";
          this.previews = [];
          this.attachments = [];

          // Maintain focus on keyboard for mobile
          this.$refs.message.focus();
        },
        // This function deselects a file so users can cancel
        deselect(i){
            this.attachments.splice(i, 1);
            this.previews.splice(i, 1);
        },
        deselectAll(){
            this.attachments = [];
            this.previews = [];
        },
        // This is the function that triggers the typing sounds
        // It can be turned off from the settings
        typing(){

            if (this.typingSfx == 'false') return 

            // Send new message
            // this.socket.emit('typing', {user: localStorage.token});
            this.typingSound = new Audio(this.typingSoundUrl);
            this.typingSound.volume = 0.2;
            this.typingSound.play();
            this.typingSound.currentTime = 0;
        },
        // This function parses files when dragging and dropping on the DM
        handleFilePaste(event) {
            let files = event.clipboardData.items;
            if(!files) return;
            files.forEach(file => {
                var blob = file.getAsFile();
                this.attachments.push({file: blob});
                this.previews.push(URL.createObjectURL(blob));
            });
        },
        // This function parses files when dragging and dropping on the DM
        handleFileDrop(event) {
            let files = event.dataTransfer.files;
            if(!files) return;
            files.forEach(file => {
                this.attachments.push({file: file, name: file.name});
                this.previews.push(URL.createObjectURL(file));
            });
        },
        // This function parses files when adding them through the input box
        handleFileInput() {
            let files = this.$refs.files.files;
            if(!files) return;
            files.forEach(file => {
                this.attachments.push({file: file, name: file.name});
                this.previews.push(URL.createObjectURL(file));
            });
        },
        // Fetches right translation of the site
        translation(sentence){
            if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
            else this.languageTable = require(`@/languages/${localStorage.language}.json`);
            let translatedSentence = this.languageTable[sentence];
            if (!translatedSentence) return sentence;
            return translatedSentence;
        },
    }
}

</script>

<style scoped>

.sendMessageContainer {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.sendMessage { 
  margin: 0px 16px;
  border-radius: 24px;
  background: #F1F2F4;
  width: 100%;
}

.sendMessage .images {
  max-height: 368px;
  overflow-y: scroll;
}

.sendMessage .inputFields {
  display: flex;
  align-items: center;
}

.sendMessage .plusButton {
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-left: 8px;
}

.sendMessage.darkmode { background: var(--darkmodeDark); }

.sendMessage .inputFields .quickButton {
  outline: none;
  white-space: nowrap;
  border: none;
  background: transparent;
  font-weight: 400;
  color: #0094FF;
  cursor: pointer;
  font-size: 14px;
  margin-right: 16px;
}
.sendMessage .inputFields .quickButton.removeAll { color: #888888 !important }

.sendMessage button:hover { cursor: pointer; }

.sendMessage input[type=text] {
  outline: none;
  border: none;
  width: 100%;
  text-indent: 8px;
  background: #F1F2F4;
  border-radius: 100px; 
  height: 44px;
  font-style: normal;
  font-weight: 500;
  z-index: 3px;
}

.sendMessage input[type=text].darkmode {
  color: white;  /* darkmode */
  background: var(--darkmodeDark);
}

.sendMessage input[type=text]::placeholder { 
  color: #81859D; 
}
.formImageInput {
  display: none;
}

.previewFile {
  border-radius: 8px;
  height: 64px;
  width: auto;
  margin: 8px;
  cursor: pointer;
  transition: 100ms ease;
  max-width: -moz-available;
  max-width: -webkit-fill-available;
}

.previewFile:hover { opacity: 50%; }

.dropArea {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
}

.submit {
  width: 28px;
  height: 28px;
  outline: none;
  border: none;
  background: transparent;
  margin-left: 24px;
  filter: invert(100%) sepia(83%) saturate(373%) hue-rotate(177deg) brightness(99%) contrast(80%);
  cursor: not-allowed;

}

.submit img {
  width: inherit;
  transform: translateY(-6px) rotate(-30deg);
  height: inherit;
}

.ready {
  filter: invert(68%) sepia(10%) saturate(5037%) hue-rotate(301deg) brightness(112%) contrast(101%);
  cursor: pointer;
}

@media only screen and (min-width: 715px)  {
  .sendMessageContainer { bottom: 8px; }
}

</style>
