import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./router";
import "./services/state";
import "./services/api";

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

updateSW();

createApp(App).use(router).mount("#app");
