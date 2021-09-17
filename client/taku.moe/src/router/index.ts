import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "taku.moe | Login",
      guest: true
    }
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
    meta: {
      title: "taku.moe | Signup",
      guest: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;