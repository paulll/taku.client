import { createRouter, createWebHistory } from "vue-router";
import { useState } from "../services/state";
const state = useState();
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
  {
    path: "/chat/:channel_uuid",
    name: "chat",
    component: () => import("../views/Global Chat.vue"),
    meta: {
      title: "taku.moe | Global Chat",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!state.getToken();

  // If they are logged in don't let them go to signup/login
  if (isAuthenticated && to.name === 'login' || to.name === 'signup') return next({name: "user", params: {uuid: state.getMe()?._id}});

  // If they aren't logged in don't let them go anywhere besides signup/login
  if (!isAuthenticated && to.name !== 'login' && to.name !== 'signup') return next({ name: 'login' });
  next()
})

export default router;
