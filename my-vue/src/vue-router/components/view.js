export default {//函数式组件
    functional: true,
    render (h, { parent }) {
      const routeMap = parent.$router.routeMap;
      const path = parent.$route.path;
      return h(routeMap[path]);
    }
  };