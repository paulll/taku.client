import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from "./router";
import './services/api';
import './services/state';

createApp(App).use(router).mount('#app')
