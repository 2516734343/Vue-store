# VueRouter_基础

## 什么是路由？
路由是根据不同的url地址展现不同的内容或页面。
早期的路由都是后端直接根据url来重载页面实现的，即后端控制路由。
后来页面越来越复杂，服务器压力越来越大，随着ajax（异步刷新技术）的出现，页面的实现非重载就能刷新数据，让前端也可以控制url自行管理，前端路由由此而生。

## 什么时候使用前端路由？
前端路由更多用在单页应用上，也就是SPA(Single Page Web Application)，在单页面应用中，大部分页面结果不变，只改变部分内容的使用。

## 安装路由
> 安装：``npm install vue-router``。

## 使用路由
### JavaScript
1. 引入路由
```js
import VueRouter from 'vue-router';
```

2. 使用路由
```js
Vue.use(VueRouter);
```

3. 定义路由组件
```js
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
```

4. 定义路由
```js
// 每个路由应该映射一个组件
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]
```

5. 创建 router 实例，然后传 `routes` 配置
```js
const router = new VueRouter({
  routes 
})
```

6. 创建和挂载根实例
```js
const app = new Vue({
  router
}).$mount('#app')
```

### html
```html
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>
```




## router-link class
- router-link-exact-active 当前展示路径完全匹配组件to属性的值
- router-link-active  当前展示路径包含to属性的值

> 更改class名
```js
VueRouter({
  linkActiveClass: 'link-active',
  linkExactActiveClass: 'link-exact-active',
})
```

## hash模式
vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。

## history 模式
如果不想要很丑的 hash，我们可以用路由的 history 模式，这种模式充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。
在路由配置中设置：
```js
VueRouter({
  mode: 'history',
})
```
当你使用 history 模式时，URL 就像正常的 url，例如 http://yoursite.com/user/id, 也好看！

不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 http://oursite.com/user/id 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。

# VueRouter_命名路由-嵌套路由-重定向-别名

## 命名路由
可以通过一个名称标识一个路由，这样在某些时候会显得更方便一些，特别是在链接一个路由，或者是执行一些跳转时，可以在创建Router实例时，在routes配置中给某个路由设置名称：
```js
routes = [
  {
    path: '/activity/personal',
    name: 'personal',
    component: Personal,
  }
];
```
要链接到一个命名路由，可以给 ``router-link`` 的 to 属性传一个对象：
```html
<router-link :to="{ name: 'personal' }">个人中心</router-link>
```

## 嵌套路由
一个被 router-view 渲染的组件想要包含自己的嵌套 router-view 时，可以使用嵌套路由，如：
```js
{
  path: '/activity',
  component: () => import('./views/Activity'),
  children: [
    {
      path: '/activity/academic',
      name: 'academic',
      component: () => import('./views/Academic'),
    },
    {
      path: '/activity/personal',
      name: 'personal',
      component: () => import('./views/Personal'),
    },
    {
      path: '/activity/download',
      name: 'download',
      component: () => import('./views/Download'),
    }
  ],
}
```
经过这样的设置，在 Activity 组件中就可以使用 router-view 了。
子路由的path可以简写：
```js
path: 'personal'
```
这样会自动将父路由的路径，拼接在子路由前，最终结果为：/activity/personal。

当访问 /activity 下的其他路径时，并不会渲染出来任何东西，如果想要渲染点什么，可以提供一个空路由：
```js
{
  path: '/activity',
  children: [
    {
      path: '',
      component: () => import('./views/Academic'),
    },
  ],
}
```

## 重定向
重定向也是通过 routes 配置来完成，下面例子是从 /a 重定向到 /b
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```
重定向的目标也可以是一个命名的路由：
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```
甚至是一个方法，动态返回重定向目标：
```js
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```

## 别名
“重定向”的意思是，当用户访问 /a时，URL 将会被替换成 /b，然后匹配路由为 /b，那么“别名”又是什么呢？

/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。

上面对应的路由配置为：

```js
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```

# VueRouter_编程式的导航
通过在 Vue 根实例的 router 配置传入 router 实例，\$router、 \$route 两个属性会被注入到每个子组件。

## $router
路由实例对象。

除了使用  ``<router-link>`` 创建 a 标签来定义导航链接，我们还可以借助 router 的实例
方法，通过编写代码来实现。

### $router.push
想要导航到不同的 URL，则使用 router.push 方法。这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，则回到之前的 URL。

当你点击 ``<router-link>`` 时，这个方法会在内部调用，所以说，点击 ``<router-link :to="...">`` 等同于调用 \$router.push(...)。

声明式 | 编程式
:-: | :-:
``<router-link :to="...">`` | this.$router.push(...) 

该方法的参数可以是一个字符串路径，或者一个描述地址的对象。例如：
```js
// 字符串
this.$router.push('home')

// 对象
this.$router.push({ path: 'home' })

// 命名的路由
this.$router.push({ name: 'user' })
```

### $router.replace
跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是替换掉当前的 history 记录。

声明式 | 编程式
:-: | :-:
``<router-link :to="..." replace>`` | this.$router.replace(...) 

### $router.go(n)
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。

```js
// 在浏览器记录中前进一步，等同于 history.forward()
this.$router.go(1)

// 后退一步记录，等同于 history.back()
this.$router.go(-1)

// 前进 3 步记录
this.$router.go(3)

// 如果 history 记录不够用，那就默默地失败呗
this.$router.go(-100)
this.$router.go(100)
```

## $route
只读，路由信息对象。

### $route.path
字符串，对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。

### $route.params
一个 key/value 对象，包含了动态片段和全匹配片段，如果没有路由参数，就是一个空对象。

### $route.query
一个 key/value 对象，表示 URL 查询参数。例如，对于路径 /foo?user=1，则有 \$route.query.user == 1，如果没有查询参数，则是个空对象。

### $route.hash
路由的 hash 值 (带 #) ，如果没有 hash 值，则为空字符串。

### $route.fullPath
完成解析后的 URL，包含查询参数和 hash 的完整路径。

### $route.matched
一个数组，包含当前路由的所有嵌套路径片段的路由记录 。路由记录就是 routes 配置数组中的对象副本 (还有在 children 数组)。
    ```js
      const router = new VueRouter({
        routes: [
          // 下面的对象就是路由记录
          {
            path: '/foo',
            component: Foo,
            children: [
              // 这也是个路由记录
              { path: 'bar', component: Bar }
            ]
          }
        ]
      })
    ```

    当 URL 为 /foo/bar，\$route.matched 将会是一个包含从上到下的所有对象 (副本)。

### $route.name
当前路由的名称，如果有的话

### $route.redirectedFrom
如果存在重定向，即为重定向来源的路由的名字。

# VueRouter_动态路由匹配
当我们需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”来达到这个效果：
```js
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```
经过这样的设置，像 /user/foo 和 /user/bar 都将映射到相同的路由。

一个“路径参数”使用冒号 : 标记。当匹配到一个路由时，参数值会被设置到 this.$route.params，可以在每个组件内使用。

# VueRouter_命名视图-路由组件传参
## 命名视图
想同时展示多个视图时，并且每个视图展示不同的组件时，可以使用命名视图。

可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。如果 router-view 没有设置名字，那么默认为 default。
```html
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置 (带上 s)：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

## 路由组件传参
在组件中使用 $route 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。

使用 props 将组件和路由解耦。

## 布尔模式
如果 props 被设置为 true，route.params 将会被设置为组件属性。

## 对象模式
如果 props 是一个对象，它会被按原样设置为组件属性。当 props 是静态的时候有用。
```js
const router = new VueRouter({
  routes: [
    { 
      path: '/promotion/from-newsletter', 
      component: Promotion, 
      props: { newsletterPopup: false } 
    }
  ]
})
```

## 函数模式
你可以创建一个函数返回 props。函数的第一个参数是 route （即$route）。
```js
const router = new VueRouter({
  routes: [
    { path: '/search', component: SearchUser, props: (route) => ({ query: route.query.q }) }
  ]
})
```

# VueRouter_导航守卫
导航：路由正在发生变化。

导航守卫主要用来通过跳转或取消的方式守卫导航。

导航守卫被分成三种：全局的、单个路由独享的、组件内的。

## 全局守卫
是指路由实例上直接操作的钩子函数，触发路由就会触发这些钩子函数。

### 全局前置守卫 beforeEach
在路由跳转前触发，一般被用于登录验证。
```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

参数说明：

* to 目标路由对象
* from 即将要离开的路由对象
* next 三个参数中最重要的参数。
    1. 必须调用next()，才能继续往下执行一个钩子，否则路由跳转会停止
    2. 若要中断当前的导航，可以调用next(false)。
    3. 可以使用next跳转到一个不同的地址。终端当前导航，进入一个新的导航。next参数值和$routet.push一致。
    4. next(error)。2.4+，如果传入的参数是一个Error实例，则导航会被终止，且该错误会被传递给router.onError() 注册过的回调。

### 全局解析守卫 beforeResolve
和boforeEach类似，路由跳转前触发。

和beforeEach的区别：在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。
```js
const router = new VueRouter({ ... })

router.beforeResolve((to, from, next) => {
  // ...
})
```

### 全局后置钩子 afterEach
和beforeEach相反，路由跳转完成后触发。
```js
const router = new VueRouter({ ... })

router.afterEach((to, from) => {
  // ...
})
```

## 路由独享守卫
是指在单个路由配置的时候也可以设置的钩子函数。

### beforeEnter
和beforeEach完全相同，如果都设置则在beforeEach之后紧随执行。
```js
const router = new VueRouter({
  routes: [
    {
      path: '/home',
      component: Home,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

## 组件内守卫
是指在组件内执行的钩子函数，类似于组件内的生命周期，相当于为配置路由的组件添加的生命周期钩子函数。

### beforeRouteEnter
路由进入之前调用。

**在该守卫内访问不到组件的实例，this值为undefined。**在这个钩子函数中，可以通过传一个回调给 next来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数，可以在这个守卫中请求服务端获取数据，当成功获取并能进入路由时，调用next并在回调中通过 vm访问组件实例进行赋值等操作，（next中函数的调用在mounted之后：为了确保能对组件实例的完整访问）。
```js
beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建

    next( vm => {
    // 通过 `vm` 访问组件实例
  })
  },
  ```

### beforeRouteUpdate
在当前路由改变时，并且该组件被复用时调用，可以通过this访问实例。

何时组件会被复用？

动态路由间互相跳转
路由query变更
```js
beforeRouteUpdate (to, from, next) {
  // 在当前路由改变，但是该组件被复用时调用
  // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
  // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
  // 可以访问组件实例 `this`
},
```

### beforeRouteLeave
导航离开该组件的对应路由时调用，可以访问组件实例this。
```js
beforeRouteLeave (to, from, next) {
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
}
```

## 完整的导航解析流程
1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

# VueRouter_路由元信息
定义路由的时候可以配置 meta 字段，用于自定义一些信息。
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          meta: { requiresLogin: true }
        }
      ]
    }
  ]
})
```
# VueRouter_过渡动效-滚动行为

## 过渡动效
是基本的动态组件，所以我们可以用 组件给它添加一些过渡效果。
```html
<transition>
  <router-view></router-view>
</transition>
```
## 滚动行为
使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，就像重新加载页面那样。vue-router 可以自定义路由切换时页面如何滚动。

注意: 这个功能只在支持 history.pushState 的浏览器中可用。

当创建一个 Router 实例，你可以提供一个 scrollBehavior 方法：
```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})
```
scrollBehavior 方法接收 to 和 from 路由对象。第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。

scrollBehavior 返回滚动位置的对象信息，长这样：

* { x: number, y: number }
* { selector: string, offset? : { x: number, y: number }} (offset 只在 2.6.0+ 支持)
```js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash // selector 的 值为 hash值
    }
  }
}
```