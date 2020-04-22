# 组件基础

## 组件是什么？
组件是可复用的Vue实例，且带有一个名字，例如名字为shanshan-cmp，那么我们则可以在一个通过new Vue创建的根实例中，把这个组件作为自定义元素来使用：
```html
<div id="app">
  <shanshan-cmp></shanshan-cmp>
</div>
```
```js
const vm = new Vue({
  el: '#app'
})
```
因为组件是可复用的 Vue 实例，所以它们与 new Vue 接收相同的选项，例如 data、computed、watch、methods 以及生命周期钩子等。仅有的例外是像 el 这样根实例特有的选项。

## 组件注册

### 全局组件
> Vue.component

利用Vue.component创建的组件组件是全局注册的。也就是说它们在注册之后可以用在任何新创建的 Vue 根实例 (new Vue) 的模板中。

参数：
  - {string}
  - {Function | Object} [definition]

用法：
  注册或获取全局组件。注册还会自动使用给定的id设置组件的名称。

示例：
```html
<div id="app">
  <button-counter></button-counter>
</div>
```

```js
Vue.component('button-counter', {
  data () {
    return {
      count: 0,
    }
  },
  template: `
    <button @click="count ++">你按了我{{ count }}次</button>
  `
})

const vm = new Vue({
  el: '#app',
})
```

### 局部组件
在components选项中定义要使用的组件。
对于 components 对象中的每一个属性来说，其属性名就是自定义元素的名字，其属性值就是这个组件的选项对象。

示例：
```html
<div id="#app">
  <button-counter></button-counter>
</div>
```
```js
const buttonCounter = {
  data () {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count ++">你按了我{{ count }}次</button>
  `,
}

const vm = new Vue({
  el: '#app',
  components: {
    'button-counter': buttonCounter
  }
})
```

### 组件名
在注册一个组件的时候，我们始终需要给它一个名字。你给予组件的名字可能依赖于你打算拿它来做什么，所以命名要语义化。

> 组件名大小写

定义组件名的方式有两种：

> 使用kebab-case (横短线分隔命名)

```js
Vue.component('my-component', {/***/});
```

当使用kebab-case定义一个组件时，你必须在引用这个自定义元素时使用kebab-case，例如：``<my-component></my-component>``。

> 使用PascalCase (大驼峰命名)

```js
Vue.component('MyComponent', {/***/});
```
当使用PascalCase定义一个组件时，你在引用这个自定义元素时两种命名法都可以。也就是说``<my-component-name>`` 和 ``<MyComponentName>`` 都是可接受的。注意，尽管如此，直接在 DOM (即字符串模板或单文件组件) 中使用时只有 kebab-case 是有效的。

另：我们强烈推荐遵循 W3C 规范中的自定义组件名 (字母全小写且必须包含一个连字符)。这会帮助你避免和当前以及未来的 HTML 元素相冲突。

### 组件复用
可以将组件进行任意次数的复用：
```html
<div id="#app">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```
### 自闭合组件
在单文件组件、字符串模板和 JSX 中没有内容的组件应该是自闭合的——但在 DOM 模板里永远不要这样做。

自闭合组件表示它们不仅没有内容，而且刻意没有内容。其不同之处就好像书上的一页白纸对比贴有“本页有意留白”标签的白纸。而且没有了额外的闭合标签，你的代码也更简洁。

不幸的是，HTML 并不支持自闭合的自定义元素——只有官方的“空”元素。所以上述策略仅适用于进入 DOM 之前 Vue 的模板编译器能够触达的地方，然后再产出符合 DOM 规范的 HTML。

### 组件的data选项
当我们定义一个组件时，它的 data 并不是像这样直接提供一个对象：
```js
data: {
  count: 0
}
```
取而代之的是，一个组件的 data 选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝：
```js
data () {
  return {
    count: 0
  }
}
```
如果 Vue 没有这条规则，点击一个按钮就可能会像下面一样影响到其它所有实例:

![avatar](https://developer.duyiedu.com/myVue/data.gif)

### 单个根元素
每个组件必须只有一个根元素，当模板的元素大于1时，可以将模板的内容包裹在一个父元素内。

# 组件_Prop

## 注册自定义特性
组件默认只是写好结构、样式和行为，使用的数据应由外界传递给组件。
> 如何传递？注册需要接收的prop，将数据作为一个自定义特性传递给组件。

如：
```html
<div id="app">
  <video-item 
    title="羊村摇" 
    poster="https://developer.duyiedu.com/bz/video/955bac93ccb7f240d25a79b2ff6a9fdbda9537bc.jpg@320w_200h.webp" 
    play="638000" 
    rank="1207"
  ></video-item>
</div>
```
```js
Vue.component('video-item', {
  props: ['title', 'poster', 'play', 'rank'],
})
```
在上述模板中，你会发现我们能够在组件实例中访问这个值，就像访问 data 中的值一样：
```html
<div id="app">
  <video-item 
    title="羊村摇" 
    poster="https://developer.duyiedu.com/bz/video/955bac93ccb7f240d25a79b2ff6a9fdbda9537bc.jpg@320w_200h.webp" 
    play="638000" 
    rank="1207"
  ></video-item>
</div>
```
```js
Vue.component('video-item', {
  props: ['title', 'poster', 'play', 'rank'],
  template: `<div>{{ title }}</div>`
})
```

## Prop的大小写

HTML 中的特性名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。故：当 传递的prop为 短横线分隔命名时，组件内 的props 应为 驼峰命名 。
如：
```html
<div id="app">
  <!-- 在 HTML 中是 kebab-case 的 -->
  <video-item sub-title="hello!"></video-item>
</div>
```
```js
Vue.component('video-item', {
  // 在 JavaScript 中是 camelCase 的
  props: ['subTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
```
要注意的是：如果使用的是字符串模板，那么这个限制就不存在了。

## 传递静态或动态 Prop
像这样，我们已经知道了可以给 prop 传入一个静态的值：
```html
<video-item title="羊村摇"></video-item>
```

若想要传递一个动态的值，可以配合v-bind指令进行传递，如：
```html
<video-item :title="title"></video-item>
```

### 传递一个对象的所有属性
如果你想要将一个对象的所有属性都作为 prop 传入，你可以使用不带参数的 v-bind 。例如，对于一个给定的对象 person：
```js
person: {
  name: 'shanshan',
  age: 18
}
```

传递全部属性：
```html
<my-component v-bind="person"></my-component>
```

上述代码等价于：
```html
<my-component
  :name="person.name"
  :age="person.age"
></my-component>
```

# 组件_Prop验证
我们可以为组件的 prop 指定验证要求，例如你可以要求一个 prop 的类型为什么。如果说需求没有被满足的话，那么Vue会在浏览器控制台中进行警告，这在开发一个会被别人用到的组件时非常的有帮助。

为了定制 prop 的验证方式，你可以为 props 中的值提供一个带有验证需求的对象，而不是一个字符串数组。例如：

```js
Vue.component('my-component', {
  props: {
    title: String,
    likes: Number,
    isPublished: Boolean,
    commentIds: Array,
    author: Object,
    callback: Function,
    contactsPromise: Promise
  }
})
```

上述代码中，对prop进行了基础的类型检查，类型值可以为下列原生构造函数中的一种：``String``、``Number``、``Boolean``、``Array``、``Object``、``Date``、``Function``、``Symbol``、任何自定义构造函数、或上述内容组成的数组。
需要注意的是`null` 和 `undefined` 会通过任何类型验证。
除基础类型检查外，我们还可以配置高级选项，对prop进行其他验证，如：类型检测、自定义验证和设置默认值。
如：
```js
Vue.component('my-component', {
  props: {
    title: {
      type: String, // 检查 prop 是否为给定的类型
      default: '小辣椒最美',   // 为该 prop 指定一个默认值，对象或数组的默认值必须从一个工厂函数返回，如：default () { return {a: 1, b: 10} },
      required: true, // 定义该 prop 是否是必填项
      validator (prop) {  // 自定义验证函数，该prop的值回作为唯一的参数代入，若函数返回一个falsy的值，那么就代表验证失败
        return prop.length < 140;
      }
    }
  }
})
```

为了更好的团队合作，在提交的代码中，prop 的定义应该尽量详细，至少需要指定其类型。