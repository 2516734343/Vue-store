# Vuex_State
Vuex是vue的状态管理工具，为了更方便的实现多个组件共享状态。

## 安装
```js
npm install vuex --save
```

## 使用
```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  }
})

new Vue({
  store,
})
```

## State
单一状态树，使用一个对象就包含了全部的应用层级状态。

### 在Vue组件中获得Vuex状态
Vuex 通过store 选项，提供了一种机制将状态从跟组件“注入”到每一个子组件中（调用Vue.use(Vuex)）。

通过在根实例中注册store选项，该store实例会注入到根组件下的所有子组件中，且子组件能通过this.\$store访问。
```html
<div class="home">
  {{ $store.state.count }}
</div>
```

### mapState 辅助函数
当一个组件需要获取多个状态时，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用mapState辅助函数帮助我们生成计算属性：

```js
import { mapState } from 'vuex';

computed: {
  ...mapState(['count']),
},

```
使用不同的名字：
```js
computed: {
  ...mapState({
    storeCount: state => state.count,
    // 简写
    storeCount: 'count', // 等同于 state => state.count
  }),
},

```

# Vuex_Getter
store的计算属性。getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接收state作为其第一个参数、getters作为其第二个参数。

```js
getters: {
  doubleCount (state) {
    return state.count * 2;
  }
}
```

## 通过属性访问
Getter会暴露为store.getters对象：``this.$store.getters.doubleCount``

## 通过方法访问
也可以让getter返回一个函数，来实现给getter传参
```js
getters: {
  addCount: state => num => state.count + num;
}
```
```js
this.$store.addCount(3);
```

## mapGetters 辅助函数
```js
import { mapsGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'doubleCount',
      'addCount',
    ])
  }
}
```

如果你想将一个 getter 属性另取一个名字，使用对象形式：
```js
mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  storeDoubleCount: 'doubleCount'
})
```

# Vuex_Mutation
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```

不能直接调用一个mutation handler。这个选项更像是事件注册：“当触发一个类型为``increment``的mutation时，调用次函数。”：
```js
this.$store.commit('increment');
```

## 在组件中提交 Mutation
除了在组件中使用 ``this.$store.commit('xxx')`` 提交 mutation之外，还可以使用 mapMutations 辅助函数：
```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    ]),
    ...mapMutations({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

## 提交载荷（Payload）
你可以向store.commit传入额外的参数，即mutation的载荷（payload）：
```js
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```
```js
store.commit('increment', 10)
```
在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的mutation会更易读：
```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```
```js
store.commit('increment', {
  amount: 10
})
```

## 对象风格的提交方式
提交 mutation 的另一种方式是直接使用包含 type 属性的对象：
```js
store.commit({
  type: 'increment',
  amount: 10
})
```
当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：
```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

## 使用常量替代 Mutation 事件类型
把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
```js
// mutation-types.js
export const COUNT_INCREMENT = 'COUNT_INCREMENT'
```
```js
// store.js
import Vuex from 'vuex'
import { COUNT_INCREMENT } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    [COUNT_INCREMENT] (state) {
      // ...
    }
  }
})
```
用不用常量取决于自己，在需要多人协作的大型项目中，这会很有帮助。

## Mutation 需遵守 Vue 的响应规则
既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

- 最好提前在你的 store 中初始化好所有所需属性。
- 当需要在对象上添加新属性时，你应该
  - 使用 Vue.set(obj, 'newProp', 123), 或者
  - 以新对象替换老对象。例如，利用对象展开运算符我们可以这样写：
    ```js
    state.obj = { ...state.obj, newProp: 123 }
    ```

## 表单处理
在Vuex的state上使用v-model时，由于会直接更改state的值，所以Vue会抛出错误。

如果想要使用双向数据的功能，就需要自己模拟一个v-model: :value="msg" @input="updateMsg"。

### 双向绑定的计算属性
上面的做法，比v-model本身繁琐很多，所以我们还可以使用计算属性的setter来实现双向绑定：
```html
<input v-model="msg">
```

```js
computed: {
  msg: {
    get () {
      return this.$store.state.obj.msg;
    },
    set (value) {
      this.$store.commit(UPDATE_MSG, { value });
    }
  }
}
```

## Mutation 必须是同步函数
要记住 **mutation 必须是同步函数**。why？

```js
mutations: {
  [COUNT_INCREMENT] (state) {
    setTimeout(() => {
      state.count ++;
    }, 1000)
  },
}
```
执行上端代码，我们会发现更改state的操作是在回调函数中执行的，这样会让我们的代码在devtools中变的不好调试：当 mutation 触发的时候，回调函数还没有被调用，devtools 不知道什么时候回调函数实际上被调用，任何在回调函数中进行的状态的改变都是不可追踪的。

## 严格模式
开启严格模式，仅需在创建 store 的时候传入 strict: true：

```js
const store = new Vuex.Store({
  // ...
  strict: true
})
```
在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

### 开发环境与发布环境
不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更，要确保在发布环境下关闭严格模式，以避免性能损失。

```js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

# Vuex_Action
Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters:

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

## 分发Action
```js
store.dispatch('increment')
```
虽然和mutation差不多，但是在action中，可以执行异步操作，但是mutation中不行！！！
```js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```


## 组合 Action
Action 通常是异步的，那么如何知道 action 什么时候结束呢？
```js
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```
```js
store.dispatch('actionA').then(() => {
  // ...
})
```

## Vuex 管理模式
![](https://vuex.vuejs.org/vuex.png)

# Vuex_Module
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter。

```js
modules: {
  a,
  b
}
```
- 获取 state：this.\$store.state.moduleName.xxx
- 获取 getter：this.\$store.getters.xxx
- 提交 mutation：this.\$store.commit('xxx');
- 分发 action：this.\$store.dispatch('xxx');
- 可以通过mapXXX的方式拿到getters、mutations、actions，但是不能拿到state，如果想通过这种方式获得state，需要加命名空间。

## 命名空间
可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。
- 获取 state：this.\$store.state.moduleName.xxx
- 获取 getter：this.\$store.['moduleName/getters'].xxx
- 提交 mutation：this.\$store.commit('moduleName/xxx');
- 分发 action：this.\$store.dispatch('moduleName/xxx');
- 可以通过mapXXX的方式获取到state、getters、mutations、actions。

## 模块的局部状态

对于模块内部的 mutation 和 getter，接收的第一个参数是模块的局部状态对象。

同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState。

对于模块内部的 getter，根节点状态会作为第三个参数暴露出来。