import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Taku | Home',
    },
  },
  {
    path: '/signup/',
    name: 'Signup',
    component: () => import('../views/Signup.vue'),
    meta: {
      title: 'Taku | Signup',
    },
  },
  {
    path: '/login/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Taku | Login',
    },
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/settings/:setting?', // the ? makes the param optional so the default route works
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: 'Taku | Settings',
    },
  },
  {
    path: '/messages/:type?/:channel_uuid?',
    name: 'Messages',
    component: () => import('../views/Messages.vue'),
    meta: {
      title: 'Taku | Messages',
    },
  },
  {
    path: '/wallpaper/:wallpaper_uuid?',
    name: 'Wallpaper',
    component: () => import('../views/Wallpaper.vue'),
    meta: {
      title: 'Taku | Wallpaper',
    },
  },
  {
    path: '/anime/:id',
    name: 'Anime',
    component: () => import('../views/Anime.vue'),
    meta: {
      title: 'Taku | Anime',
    },
  },
  {
    path: '/upload/',
    name: 'Upload',
    component: () => import('../views/Upload.vue'),
    meta: {
      title: 'Taku | Upload',
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
  if (to.path.startsWith('/profile/')) document.title = "Taku | " + to.params.username; 
  next();
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
