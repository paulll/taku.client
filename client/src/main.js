import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
// import Cache from '@/services/cache.js';

const DEV_MODE = true;                          // Determines if the app is in development mode, disables https and other stuff for compability

const emitter = mitt();

let app = createApp(App);
app.use(router);
app.config.globalProperties.emitter = emitter;                                       
app.config.globalProperties.DEV_MODE = DEV_MODE;            
if(DEV_MODE) {
    app.config.globalProperties.rootPath = 'http://localhost';
} else {
    app.config.globalProperties.rootPath = 'https://taku.moe';
}
// app.config.globalProperties.cache = Cache;
app.mount('#app');

