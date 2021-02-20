import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '🏠 taku',
    },
  },
  {
    path: '/signup/',
    name: 'signup',
    component: () => import('../views/Signup.vue'),
    meta: {
      title: '⚙ Signup',
    },
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '⚙ Login',
    },
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: () => import('../views/Profile.vue')
  },
  {
    path: '/settings/:setting?', // the ? makes the param optional so the default route works
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '⚙ Settings',
    },
  },
  {
    path: '/messages/:user?', // the ? makes the param optional so the default route works
    name: 'Messages',
    component: () => import('../views/Messages.vue'),
    meta: {
      title: '⚙ Messages',
    },
  },
  {
    path: '/dm/',
    name: 'DMs',
    component: () => import('../views/DMs.vue'),
    meta: {
      title: '💬 DMs',
    },
  },
  {
    path: '/anime/:id',
    name: 'Anime',
    component: () => import('../views/Anime.vue'),
    meta: {
      title: 'Anime',
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// this sets the tab title to the current page dynamically
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) document.title = to.meta.title;
  if (to.path.startsWith('/profile/')) document.title = "taku | " + to.params.username; 
  next();
});
export default router
