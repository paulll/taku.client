import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '🏠 Anihuu',
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
    path: '/settings/',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '⚙ Settings',
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
router.beforeEach((to, from, next) => {
  if (to.meta.title) document.title = to.meta.title;
  if (to.path.startsWith('/profile/')) document.title = "Anihuu | " + to.params.username; 
  next();
});
export default router
