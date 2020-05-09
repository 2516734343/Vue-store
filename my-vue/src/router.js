import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: Home,
    // alias: '/',
  },
  {
    path: '/learn',
    // component: () => import('./views/Learn'),
    components: {
      default: () => import('./views/Learn'),
      student: () => import('./views/Student'),
    },
  },
  {
    path: '/student',
    component: () => import('./views/Student'),
  },
  {
    path: '/about',
    component: () => import('./views/About'),
  },
  {
    path: '/activity',
    component: () => import('./views/Activity'),
    // redirect (to) {
    //   return {
    //     name: 'academic',
    //   }
    // },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
 
});

export default router;