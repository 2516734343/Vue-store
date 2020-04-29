import install from './install';
import History from './history';

class VueRouter {
  constructor (options) {
    this.routeMap = this.createRouteMap(options.routes || []);
    this.history = new History();
    this.mode = options.mode || 'hash';
    this.init();
  }

  createRouteMap (routes) {
    const routeMap = {};

    for(let i = 0; i < routes.length; i ++) {
      const route = routes[i];
      routeMap[route.path] = route.component;
    }

    return routeMap;
  }

  init () {//hash模式
    if(this.mode === 'hash') {
      location.hash ? '' : location.hash = '/';

      //监听页面加载完毕
      document.addEventListener('DOMContentLoaded', () => {
        this.history.current.path = location.hash.slice(1);
      })
      //监听hash改变
      window.addEventListener('hashchange', () => {
        this.history.current.path = location.hash.slice(1);
      })
    } else {//history模式
      document.addEventListener('DOMContentLoaded', () => {
        this.history.current.path = location.pathname;
      })

      window.addEventListener('popstate', () => {
        this.history.current.path = location.pathname;
      })
    }
    
  }
}

VueRouter.install = install;

export default VueRouter;