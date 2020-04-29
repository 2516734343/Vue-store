import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import auth from './utils/auth';
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
    beforeEnter (to, from, next) {
      console.log('beforeEnter');
      next();
    },
    meta:{
      requiresLogin:true,
      backAsk:true,
    }

  },
  {
    path: '/activity',
    component: () => import(/* webpackChunkName: 'academic' */'./views/Activity'),
    // redirect (to) {
    //   return {
    //     name: 'academic',
    //   }
    // },
    meta:{
      requiresLogin:true,
      backAsk:true,
    },
    children: [
      // {
      //   path: '',
      //   component: () => import('./views/Academic'),
      // },
      {
        path: 'academic',
        name: 'academic',
        component: () => import(/* webpackChunkName: 'academic' */'./views/Academic'),
      },
      {
        path: 'personal',
        name: 'personal',
        component: () => import('./views/Personal'),
      },
      {
        path: 'download',
        name: 'download',
        component: () => import('./views/Download'),
      },
    ],
  },
  {
    path: '/course',
    component: () => import('./views/About'),
    beforeEnter(to,from,next){
      console.loh('beforeEnter');
    },
  },
  {
    path: '/question/:id',
    name: 'question',
    // props: true,
    props: route => ({
      // name: route.name,
      id: route.params.id 
    }),
    component: () => import('./views/Question'),
  },
  {
    path:'/login',
    component:() => import('./views/Login')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to,from,savedPosition){
    // console.log(savedPosition);
    if(savedPosition){
      return savedPosition;
    }else{
        // return{
        //   x:0,
        //   y:0
        // }
        if(to.hash){
          return {selector:to.hash}
        }else{
              return{
                x:0,
                y:0
             }
        }
    }
  
  }
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // next(false);
  // if(to.path === '/student') {
  //   next('/about');
  //   // this.$router.push()
  // } else {
    // console.log('beforeEach');
    // next();
  // }
  // next(new Error('不让跳转'));
  // console.log(to.meta.requiresLogin);
  const isRequiresLogin = to.matched.some(item=>item.meta.requiresLogin);
  // console.log(isRequiresLogin);
  if(isRequiresLogin){
    const isLogin = auth.isLogin();
    if(isLogin){
      next();
    }else{
      const isToLogin = window.confirm('要登录后才可以浏览，要去登录吗？');
      isToLogin ? next('/login') : next(false);
    }
  }else{
    next();
  }
})

// router.beforeResolve((to, from, next) => {
//   console.log('beforeResolve');
//   next();
// })

// router.afterEach((to, from) => {
//   console.log('afterEach');
// })

// router.onError(err => {
//   console.log(err.message);
// })

export default router;