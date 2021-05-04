import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import cache from '@/services/cache.js';
import framework from '@/services/framework.js';
import api from '@/services/api.js';

const emitter = mitt();

let app = createApp(App);
app.config.devtools = true
app.use(router);
app.config.globalProperties.emitter = emitter;                                       
app.config.globalProperties.DEV_MODE = api.DEV_MODE;            
if(api.DEV_MODE) {
    app.config.globalProperties.rootPath = 'http://localhost';
} else {
    app.config.globalProperties.rootPath = 'https://taku.moe';
}
app.config.globalProperties.cache = cache;
app.config.globalProperties.api = api;
app.config.globalProperties.framework = framework;
app.mount('#app');