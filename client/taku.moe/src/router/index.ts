import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
    meta: {
      title: "taku.moe | Login",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
    meta: {
      title: "taku.moe | Signup",
    },
  },
  {
    path: "/user/:uuid?",
    name: "user",
    component: () => import("../views/User.vue"),
    meta: {
      title: "taku.moe | User",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
