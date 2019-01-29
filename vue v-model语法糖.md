# Vue 进阶教程之：详解 v-model

Vue 官网教程上关于 v-model 的讲解不是十分的详细，写这篇文章的目的就是详细的剖析一下， 并介绍 Vue 2.2  v-model改进的地方，然后穿插的再说点 Vue 的小知识。

在 Vue 中，有许多方法和 Angular 相似，这主要是因为 Angular 是 Vue 早期开发的灵感来源。然而，Augular 中存在许多问题，在 Vue 中已经得到解决。

v-model 用在 input 元素上时
v-model虽然很像使用了双向数据绑定的 Angular 的 ng-model，但是 Vue 是单项数据流，v-model 只是语法糖而已：↓

```html
<input v-model="sth" />
<input v-bind:value="sth" v-on:input="sth = $event.target.value" />
```

第一行的代码其实只是第二行的语法糖。然后第二行代码还能简写成这样：↓

```html
<input :value="sth" @input="sth = $event.target.value" />
```

要理解这行代码，首先你要知道 input 元素本身有个 oninput 事件，这是 HTML5 新增加的，类似 onchange ，每当输入框内容发生变化，就会触发 oninput ，把最新的value传递给 sth。
如果你不知道 $event 是从哪来的，那你需要点击它再复习一下文档。

我们仔细观察语法糖和原始语法那两行代码，可以得出一个结论：

在给 <input /> 元素添加 v-model 属性时，默认会把 value 作为元素的属性，然后把 'input' 事件作为实时传递 value 的触发事件

v-model 用在组件上时
v-model 不仅仅能在 input上用，在组件上也能使用，下面是一个和 Vue 官网教程类似的例子（在看这个例子时我们要考虑两个问题）：

实例演示.gif
父组件的 price 的初始值是 100，更改子组件的值能实时更新父组件的 price

```html
<div id="demo">
  <currency-input v-model="price"></currentcy-input>
  <span>{{price}}</span>
</div>
<script src="https://cdn.bootcss.com/vue/2.3.0/vue.js"></script>
<script>
Vue.component('currency-input', {
  template: `
    <span>
      <input
        ref="input"
        :value="value"
        <!--为什么这里把 'input' 作为触发事件的事件名？`input` 在哪定义的？-->
        @input="$emit('input', $event.target.value)"
      >
    </span>
  `,
  props: ['value'],// 为什么这里要用 value 属性，value在哪里定义的？貌似没找到啊？
})

var demo = new Vue({
  el: '#demo',
  data: {
    price: 100,
  }
})
</script>
```

如果你知道这两个问题的答案，那么恭喜你真正掌握了 v-model，如果你没明白，那么可以看下这段代码：↓

```html
<currency-input v-model="price"></currentcy-input>
<!--上行代码是下行的语法糖
  <currency-input :value="price" @input="price = arguments[0]"></currency-input>
-->
```

现在你知道 value 和 input 从哪来的了吧。与上面总结的类似：

给组件添加 v-model 属性时，默认会把 value 作为组件的属性，然后把 'input' 值作为给组件绑定事件时的事件名

v-model 的缺点和解决办法
在创建类似复选框或者单选框的常见组件时，v-model就不好用了。

```html
<input type="checkbox" v-model="sth" />
```

v-model 给我们提供好了 value 属性和 oninput 事件，但是，我们需要的不是 value 属性，而是 checked 属性，并且当你点击这个单选框的时候不会触发 oninput 事件，它只会触发 onchange 事件。这就尴尬了😓

因为 v-model 只是用到了 input 元素上，所以这种情况好解决：↓

```html
<input type="checkbox" :checked="status" @change="status = $event.target.checked" />
```

当 v-model 用到组件上时：↓

```html
<my-checkbox v-model="foo"></my-checkbox>
```

```js
Vue.component('my-checkbox', {
  tempalte: `<input 
               type="checkbox"
               @change="$emit('input', $event.target.checked)"
               :checked="value"
             />`
  props: ['value'],
})
```

在 Vue 2.2 版本，你可以在定义组件时通过 model 选项的方式来定制 prop/event：↓

```html
<my-checkbox v-model="foo"></my-checkbox>
```
```js
Vue.component('my-checkbox', {
  tempalte: `<input 
               type="checkbox"
               <!--这里就不用 input 了，而是 balabala-->
               @change="$emit('balabala', $event.target.checked)"
               :checked="checked"
             />`
  props: ['checked'], //这里就不用 value 了，而是 checked
  model: {
    prop: 'checked',
    event: 'balabala'
  },
})
```

看到这里我相信你肯定理解了 Vue 的 v-model，文中如有错误，欢迎在评论中指出谢谢。
码字辛苦，文章如对您有帮助，麻烦支持点赞~




