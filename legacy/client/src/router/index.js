import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
    meta: {
      title: 'Taku | Home',
    },
  },
  {
    path: '/signup/',
    name: 'signup',
    component: () => import(/* webpackChunkName: "signup" */ '@/views/Signup'),
    meta: {
      title: 'Taku | Signup',
    },
  },
  {
    path: '/login/',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
    meta: {
      title: 'Taku | Login',
    },
  },
  {
    path: '/profile/:username',
    name: 'profile',
    props: true,
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile'),
  },
  {
    path: '/settings/:setting?', // the ? makes the param optional so the default route works
    name: 'settings',
    props: true,
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings'),
    meta: {
      title: 'Taku | Settings',
    },
  },
  {
    path: '/messages/:type?/:channel_uuid?',
    name: 'messages',
    props: true,
    component: () => import(/* webpackChunkName: "messages" */ '@/views/Messages'),
    meta: {
      title: 'Taku | Messages',
    },
  },
  {
    path: '/wallpaper/:wallpaper_uuid?',
    name: 'wallpaper',
    props: true,
    component: () => import(/* webpackChunkName: "wallpaper" */ '@/views/Wallpaper'),
    meta: {
      title: 'Taku | Wallpaper',
    },
  },
  {
    path: '/anime/:id',
    name: 'anime',
    props: true,
    component: () => import(/* webpackChunkName: "anime" */ '@/views/Anime'),
    meta: {
      title: 'Taku | Anime',
    },
  },
  {
    path: '/upload/',
    name: 'upload',
    component: () => import(/* webpackChunkName: "upload" */ '@/views/Upload'),
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