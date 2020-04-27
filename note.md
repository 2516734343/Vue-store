# 过渡_单元素过渡
Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。

## 单元素/组件的过渡
Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡
- 条件渲染 (使用 v-if)
- 条件展示 (使用 v-show)
- 动态组件
- 组件根节点

## 过渡的类名
在进入/离开的过渡中，会有 6 个 class 切换。

<hr />

1. v-enter：
  定义进入过渡的开始状态。
  在元素被插入之前生效，在元素被插入之后的下一帧移除。

2. v-enter-active：
  定义进入过渡生效时的状态。
  在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。
  这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

3. v-enter-to: 
  定义进入过渡的结束状态(2.1.8+) 。
  在元素被插入之后下一帧生效 (与此同时 v-enter 被移除)，在过渡/动画完成之后移除。

<hr />

4. v-leave：
  定义离开过渡的开始状态。
  在离开过渡被触发时立刻生效，下一帧被移除。

5. v-leave-active：
  定义离开过渡生效时的状态。
  在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。
  这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

5. v-leave-to: 
  定义离开过渡的结束状态(2.1.8+) 。
  在离开过渡被触发之后下一帧生效 (与此同时 v-leave 被删除)，在过渡/动画完成之后移除。
<hr />

图示：
![过渡](https://cn.vuejs.org/images/transition.png)

## 类名前缀

1. transition 无 name 特性
  类名前缀为 v-。

2. transition 有 name 特性
  如 name 为 fade，则类名前缀为fade-。

## CSS 动画
CSS 动画用法同 CSS 过渡，区别是在动画中 v-enter 类名在节点插入 DOM 后不会立即删除，而是在 animationend 事件触发时删除。

## 自定义过渡的类名
我们可以通过以下 attribute 来自定义过渡类名：

- enter-class
- enter-active-class
- enter-to-class (2.1.8+)
- leave-class
- leave-active-class
- leave-to-class (2.1.8+)

他们的优先级高于普通的类名，这对于 Vue 的过渡系统和其他第三方 CSS 动画库（如 Animate.css）结合使用十分有用。

Animate.css 官网地址：https://daneden.github.io/animate.css/
安装方式：``npm install animate.css --save``

## 同时使用过渡和动画

可使用 type 属性，来声明需要 Vue 监听的类型，type值可为 animation 或 transition 。

当不设置type时，默认会取 transitioned 和 animationed 两者更长的为结束时刻。

## 显性的过渡时间
在一些情况下，Vue可以自动得出过渡效果的完成时机，从而对dom进行处理。

但是有些时候，我们会设置一系列的过渡效果，例如嵌套元素也有过渡动效，其过渡效果的时间长于父元素。此时我们可以设置duration属性，定制一个显性的过渡持续时间（以毫秒记）：

```html
<transition :duration="1000">...</transition>
```

也可以定制进入和移出的持续时间：
```html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

## 初始渲染的过渡
可以通过 ``appear`` attribute 设置节点在初始渲染的过渡。

和进入/离开过渡一样，同样也可以自定义 CSS 类名。如：
```js
appear-class="appear-enter"
appear-active-class="appear-enter-active"
appear-to-class="appear-enter-to"
```

## JavaScript 钩子
可以在属性中声明 JavaScript 钩子:

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"

  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```

- before-enter 动画入场前，可以在其中设置元素开始动画之前的起始样式
- enter 动画入场中，可以在其中写动画
- after-enter 动画完成后
- enter-cancelled 取消动画

对于仅使用 JavaScript 过渡的元素添加 v-bind:css="false"，Vue 会跳过 CSS 的检测。这也可以避免过渡过程中 CSS 的影响。

设置了 appear 特性的 transition 组件，也存在自定义 JavaScript 钩子：
```html
<transition
  appear
  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

> 结合 Velocity.js

Velocity.js 官网地址：http://velocityjs.org/
安装方式: ``npm install velocity-animate``

# 过渡_多元素过渡

当切换展示的元素标签名相同时，需要给每一个元素设置不同的key值，否则Vue为了效率只会替换相同标签内部的内容。

```html
<transition>
  <div v-if="show" key="world">hello world</div>
  <div v-else key="shanshan">hello shanshan</div>
</transition>
```

在一些场景中，可以通过给同一个元素的key值设置不同的状态来替代 v-if 和 v-else。如：

```html
<transition>
  <div :key="keyName">hello {{ key Name}}</div>
</transition>
```

```js
keyName: 'world',
```

## 过渡模式
Vue提供一个一个 mode 特性，可以给多个元素过渡应用不同的模式，mode 的值可为：

- in-out：新元素先进行过渡，完成之后当前元素过渡离开。
- out-in：当前元素先进行过渡，完成之后新元素过渡进入。

## 多组件过渡
我们可以使用动态组件切换展示不同的组件。

# 过渡_列表过渡
当想要给一个列表添加过渡动效时，我们可以使用 ``<transition-group>`` 组件。

该组件的特点：
- 不同于 <transition>，它会以一个真实元素呈现：默认为一个 <span>。你也可以通过 tag attribute 更换为其他元素。
- 过渡模式不可用，因为我们不再相互切换特有的元素。
- 内部元素 总是需要 提供唯一的 key 属性值。
- CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身。

## 列表的排序过渡
``<transition-group>`` 组件提供了一个新的特性：v-move，它会在元素改变定位的过程中应用。
如何使用？通过类名即可设置：.v-move {}。
当给 ``<transition-group>`` 设置 name 特性时，例如name为fade，则 v-move 在使用时，需要替换为 fade-move。

注意：当移除一个列表元素时，需要将移除的元素脱离文档流，否则，要溢出的元素在移除过渡中一直处于文档流中，会影响到后面元素的move过渡效果。

内部的实现：Vue 使用了一个叫 FLIP 简单的动画队列，使用 transforms 将元素从之前的位置平滑过渡新的位置。

需要注意的是使用 FLIP 过渡的元素不能设置为 display: inline 。作为替代方案，可以设置为 display: inline-block 或者放置于 flex 中。

## 列表的交错过渡
如果要给列表中的元素，应用更丰富的过渡效果，可以配合JavaScript钩子。

# 过渡_复用过渡
过渡可以通过 Vue 的组件系统实现复用。要创建一个可复用过渡组件，你需要做的就是将 <transition> 或者 <transition-group> 作为根组件，然后将任何子组件放置在其中就可以了。

注意：当使用函数式组件复用过渡时，不要设置css作用域。