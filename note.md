# vue的响应式-1
- 数据变化，页面就会重新渲染

- 怎么更改数据？
``` html
  <div id="app">
    {{ mrDeng }}
  </div>
```
``` js
  const vm = new Vue({
    el: '#app',
    data: {
      mrDeng: '小辣椒：风姿绰约、花枝招展'
    }
  });
  vm.mrDeng = '手如柔荑、肤如凝脂'; // 见证奇迹的时刻，页面变化啦
```
- 问：为什么data会直接出现在vm实例对象中咧？
> 答：当创建vue实例时，vue会将data中的成员代理给vue实例，目的是为了实现响应式，监控数据变化，执行某个监听函数（怎么实现的？想一想，提示：vue2.0中用Object.defineProperty，vue3.0中用proxy,试着实现一下，）

- 问：实例中除了data数据外，其他东西是啥子？
> 为了防止名称冲突。因为会将data中数据代理给vue，假如说我们自己写的data名称和vue中自带的属性冲突了，那么就会覆盖vue内部的属性，所以vue会把自己内部的属性成员名称前加上\$或\_，如果加上的是\$，代表是我们可以使用的，如果加上的是\_，是vue自己内部使用的方法或属性，我们不需要调用

- 更改的数据必须是存在的数据，否则不能重新渲染页面（未经过声明的），因为他监听不到，如：
``` html
  <!-- 即使更改了数据，也不会重新渲染页面 -->
  <div id="app">
    {{ mrDeng.wife }} 
  </div>
```
```js
  const vm = new Vue({
    el: '#app',
    data: {
      mrDeng: {
        name: '小辣椒', 
        age: 80, 
        height: '140cm', 
        weight: '100kg'
      }
    }
  })

  vm.mrDeng.wife = 'liu';
```

- 更改的数据必须已渲染过的数据，否则从性能角度考虑，不会重新渲染页面，如：
``` html
  <!-- 即使更改了数据，也不会重新渲染页面 -->
  <div id="app">
    {{ mrDeng.wife }} 
  </div>
```
```js
  const vm = new Vue({
    el: '#app',
    data: {
      msg: '小辣椒：风姿绰约、花枝招展',
      mrDeng: {
        name: '小辣椒', 
        age: 80, 
        height: '140cm', 
        weight: '100kg'
      }
    }
  })

  vm.mrDeng.wife = 'liu';
  vm.msg = '小辣椒：手如柔荑、肤如凝脂';
```

- 更改数据后，页面会立刻重新渲染吗？
> vue更新DOM的操作是异步执行的，只要侦听到数据变化，将开启一个异步队列，如果一个数据被多次变更，那么只会被推入到队列中一次，这样可以避免不必要的计算和DOM操作。

> 同步执行栈执行完毕后，会执行异步队列

```html
<div id="app">{{ msg }}</div>
```
``` js
const vm = new Vue({
  el: '#app',
  data: {
    msg: '小辣椒'
  }
})
vm.msg = '小辣椒超美的';
console.log(vm.msg); // 小辣椒超美的，此时数据已更改
console.log(vm.$el.innerHTML); // 小辣椒。此时页面还未重新渲染
```
## vm.$el
- 值为被Vue控制的元素（或者说，Vue挂载的元素）

## vm.$nextTick & Vue.nextTick
- 如何在更改数据后，看到渲染后的页面上的值？
> 答：利用vm.\$nextTick或Vue.nextTick，在页面重新渲染，DOM更新后，会立刻执行vm.$nextTick
```html
<div id="app">{{ msg }}</div>
```
``` js
const vm = new Vue({
  el: '#app',
  data: {
    msg: '小辣椒'
  }
})
vm.msg = '小辣椒超美的';
console.log(vm.msg); // 杉杉超美的，此时数据已更改
// 1. 使用vm.$nextTick
vm.$nextTick(() => {
  console.log(vm.$el.innerHTML); // 杉杉超美的
})
// 2. 使用Vue.nextTick
Vue.nextTick(() => {
  console.log(vm.$el.innerHTML); // 杉杉超美的
})
```
- vm.nextTick和Vue.nextTick还可以作为Promise使用
```html
<div id="app">{{ msg }}</div>
```
``` js
const vm = new Vue({
  el: '#app',
  data: {
    msg: '小辣椒'
  }
})
vm.msg = '小辣椒超美的';
// 1. 使用vm.$nextTick
vm.$nextTick().then(() => {
  console.log(vm.$el.innerHTML); // 小辣椒超美的
})
// 2. 使用Vue.nextTick
Vue.nextTick().then(() => {
  console.log(vm.$el.innerHTML); // 小辣椒超美的
})
```

- vm.$nextTick 和 Vue.nextTick的区别？
> Vue.nextTick内部函数的this指向window
```js
  Vue.nextTick(function () {
    console.log(this); // window
  })
```
> vm.\$nextTick内部函数的this指向Vue实例对象
```js
  vm.$nextTick(function () {
    console.log(this); // vm实例
  })
```

- 好奇nextTick是怎么实现的吗？
- 异步任务分为宏任务（macro）和微任务（micro）
- 宏任务比较慢（如setTimeout等），微任务比较快（如Promise.then()等）
- 微任务在前，宏任务在后（eventloop，事件环）
  ```js
    // 控制台打印顺序：promise > timeout
    setTimeout(() => {
      console.log('timeout');
    }, 0)  
    Promise.resolve().then(() => {
      console.log('promise');
    })
  ```
- 在nextTick的实现源码中，会先判断是否支持微任务，不支持后，才会执行宏任务
  ```js
    if(typeof Promise !== 'undefined') {
      // 微任务
      // 首先看一下浏览器中有没有promise
      // 因为IE浏览器中不能执行Promise
      const p = Promise.resolve();

    } else if(typeof MutationObserver !== 'undefined') {
      // 微任务
      // 突变观察
      // 监听文档中文字的变化，如果文字有变化，就会执行回调
      // vue的具体做法是：创建一个假节点，然后让这个假节点稍微改动一下，就会执行对应的函数
    } else if(typeof setImmediate !== 'undefined') {
      // 宏任务
      // 只在IE下有
    } else {
      // 宏任务
      // 如果上面都不能执行，那么则会调用setTimeout
    }
  ```
- 曾经vue用过的宏任务
  - MessageChannel 消息通道 宏任务

- vue的缺陷：vue会一直等待主线程上的任务执行完毕，才能执行异步任务去渲染，如果主线程出现问题，那么页面就会卡死，后面异步不会执行，但react不会，一有空就会执行异步任务。

# vue的响应式-2
- 除了未被声明过和未被渲染的数据外，还有什么数据更改后不会渲染页面？
  > 1.&nbsp;利用索引直接设置一个数组项时：
  ```html
  <!-- 即使向数组中添加了第4项，数组仍然显示3项 -->
  <div id="app">{{ list }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      dengFamily: ['邓哥', '小刘', '王小宝']
    }
  })
  vm.dengFamily[3] = '铁锤妹妹'; // 不是响应式的
  ```

  > 2.&nbsp;修改数组的长度时：
  ```html
  <!-- 更改了数组长度后，数组仍然显示1项 -->
  <div id="app">{{ list }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      dengWife: ['小刘']
    }
  })
  vm.dengWife.length = 0; // 不是响应式的
  ```

  > 3.&nbsp;添加或删除对象：
  ```html
  <div id="app">{{ deng }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      deng: {
        wife: '小刘',
        son: '王小宝',
        weight: '100kg',
        height: '140cm',
        age: 60
      }
    }
  })
  vm.deng.secondWife = '铁锤妹妹'; // 不是响应式的
  delete vm.deng.height; // 不是响应式的
  ```
- 问：要如何响应式的更新数组和对象？
  > 更改数组：<br> 1. 利用数组变异方法：push、pop、shift、unshift、splice、sort、reverse <br> 2. 利用vm.\$set/Vue.set实例方法<br>3. 利用vm.\$delete或Vue.delete删除数组中的某一项

  > vm.\$set是Vue.set的别名<br>使用方法：Vue.set(object, propertyName, value)，也就是这个意思：Vue.set(要改谁，改它的什么，改成啥)

  > vm.\$delete是Vue.delete的别名<br>使用方法：Vue.delete(object, target)，也就是这个意思：Vue.delete(要删除谁的值，删除哪个)

  ```html
  <div id="app">{{ list }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      dengFamily: ['邓哥', '小刘', '王小宝']
    }
  })
  // 使用数组变异方法
  vm.dengFamily.push('铁锤妹妹');
  // 使用vm.$set
  vm.$set(vm.dengFamily, 3, '铁锤妹妹');
  
  ```

  ```html
  <div id="app">{{ list }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      dengWife: ['小刘']
    }
  })
  // 更改长度时，可以用数组的splice方法
  vm.dengWife.splice(100); 
  ```
  > 更改对象：<br>1. 添加利用vm.\$set/Vue.set实例方法<br>2. 删除利用vm.\$delete/Vue.delete方法

  ```html
  <div id="app">{{ deng }}</div>
  ```
  ```js 
  const vm = new Vue({
    el: '#app'
    data: {
      deng: {
        wife: '小刘',
        son: '王小宝',
        weight: '100kg',
        height: '140cm',
        age: 60
      }
    }
  })
  // 添加
  vm.$set(vm.deng, 'secondWife', '铁锤妹妹');
  // 删除
  vm.$delete(vm.deng, 'height')
  ```

- 总结：
  > 更改数组用变异方法，就够了
  > 更改对象就用vm.\$set和vm.\$delete

- 问题解决了，但是为什么会这样呢？
  > Object.defineProperty的锅

# 扩展_剖析Vue响应式原理
```js
const data = {
  name: 'shanshan',
  age: 18,
  shan: {
    name: 'shanshan',
    age: 18,
    obj: {}
  },
  arr: [1, 2, 3]
}

const arrayProto = Array.prototype;
const arrayMethods = Object.create(arrayProto);
['push', 'pop', 'shift', 'unshift' ,'sort', 'splice', 'reverse'].forEach(method => {
  arrayMethods[method] = function () {
    arrayProto[method].call(this, ...arguments);
    render();
  }
})

function defineReactive (data, key, value) {
  observer(value);
  Object.defineProperty(data, key, {
    get () {
      return value;
    },
    set (newVal) {
      if(value === newVal) {
        return;
      }
      value = newVal;
      render();
    }
  })
}

function observer (data) {
  if(Array.isArray(data)) {
    data.__proto__ = arrayMethods;
    return;
  }

  if(typeof data === 'object') {
    for(let key in data) {
      defineReactive(data, key, data[key])
    }
  }
}

function render () {
  console.log('页面渲染啦');
}

function $set (data, key, value) {
  if(Array.isArray(data)) {
    data.splice(key, 1, value);
    return value;
  }
  defineReactive(data, key, value);
  render();
  return value;
}

function $delete(data, key) {
  if(Array.isArray(data)) {
    data.splice(key, 1);
    return;
  }
  delete data[key];
  render();
}

observer(data);
```
> 利用Object.defineProperty实现响应式的劣势
1. 天生就需要进行递归
2. 监听不到数组不存在的索引的改变
3. 监听不到数组长度的改变
4. 监听不到对象的增删

