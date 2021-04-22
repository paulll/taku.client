import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
// import Cache from '@/services/cache.js';

const emitter = mitt();

let app = createApp(App);
app.use(router);
app.config.globalProperties.emitter = emitter;
// app.config.globalProperties.cache = Cache;
app.mount('#app');