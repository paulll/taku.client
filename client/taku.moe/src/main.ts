import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./router";
import "./services/state";
import "./services/api";

createApp(App).use(router).mount("#app");
