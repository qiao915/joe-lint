## 1 组件样式 style 标签必须加 scoped 属性。

```vue
<style scoped>
/* ... */
</style>
```

## 2 为 v-for 设置 键值 key

```vue
<template>
  <div>
    <p v-for="item in list" :key="item.id"></p>
  </div>
</template>
```

> `键值key` 尽量使用唯一值

## 3 包装组件的绑定属性和监听函数建议用 $attri 和 $listener 来传递，这样可以避免手工挨个添加属性传递。

## 4 尽可能实现 v-model 双向绑定

为了方便使用者可以通过 `v-model` 来双向绑定响应数据，建议对于组件中某些固定属性值的 `key` 写成 `value` 和触发的事件写 `input` 事件。同时在触发 `input` 事件时，建议同时触发一个 `change` 事件，这样可以让使用者当使用 `v-model` 绑定数据时还可以通过 `change` 事件监听到数据的变化。

## 5 尽量不在模板内写 js 表达式

- 这主要是考虑到以下原因：
  - （1）复杂的行内表达式难以阅读。
  - （2）行内表达式是不能够通用的，这可能会导致重复编码的问题
  - （3）`IDE` 基本上不能识别行内表达式语法，所以使用行内表达式 `IDE` 不能提供自动补全和语法校验功能。

## 6 验证组件的 props

组件 `props` 通过自定义标签的属性来传递。属性的值可以是 `Vue.js` 字符，或是不传。你需要保证组件的 `props` 能应对不同的情况。一个稳定并可预测的 `API` 会使得你的组件更容易被其他开发者使用。

- 具体操作如下：
- （1）给`prop`提供默认值
- （2）使用`type`属性进行类型校验，如果必要的话，可以写上具体校验函数，`validator`
- （3）如果是必填的，写上`required`为`true`
- （4）使用 `props` 之前先检查该 `prop` 是否存在。

## 7 组件事件命名

- 尽量于原生的`dom`事件相区分开，遵循以下原则：
  - （1）事件名多个单词之间用连字符连接
  - （2）一个事件名对应一个有意义的操作，如：`upload-success`、`upload-error`等

## 8 避免在组件中使用 this.\$parent

如果在组件中使用`this.$parent`，这样组件只能在含有特定上下文的父组件使用，且在父组件中不知道子组件引用了它自身的某些方法或属性，不利于长期维护和复用。

## 9 组件内的样式命名

必须将组件名字作为组件内`css`样式类的命名空间。  
例如：组件名叫`my-component`,组件内部的 css 样式命名：`.my-component`、 `.my-conponent-item`等

## 10 组件属性书写顺序

- （1）传统的`vue`官方文档单组件开发模式。遵守`name`、`components`、`inject`、`props`、`mixins`、`directives`、`filters`、`data`、`computed`、`watch`、`生命周期函数`、`methods`
- （2）利用装饰器模式的`vue class`类文件，除了遵守`typescript`中`class`规范，还需上述`（1）`的书写顺序。

## 11 组件通信方式

- （1）组件内部数据建议采用`prop`和`emit`的方式进行双向传递，或者利用`provide`和`inject`进行父子孙组件之间的数据传递。
- （2）对于非页面级的组件，禁止采用通过`url`地址参数的方式来进行数据的传递，对于页面级的组件建议仍然采用定义`pro`p 的方式接收`url`地址上的参数，在路由配置处通过定义`prop`字段来传递，以方便将来作为非页面级组件使用。
- （3）除在包装组件中等特殊情况外，在组件内部不使用`$attri`和`$listener`来隐式访问外部数据，应通过`prop`显式的定义好所需的外部数据。
- （4）要提供给外部复用的组件，除极特殊情况外，不使用本地存储，vueX 等涉及到项目全局的通信方式传递数据。

## 12 组件的 prop 属性名字应避开 class、style 等原生 dom 节点属性名字

`prop`属性应避开`class`、`style`等原生`dom`节点属性的名字，以免组件使用者想添加相关原生属性时不生效。

## 13 不需要进行响应式的数据，不放在 data 字段内

## 14 外部依赖必须在 package.json 文件中写明

## 15 组件相关文档

组件开发完后必须提供组件的`api`文档、组件使用文档、有详细介绍的`readme`，及，当组件进行版本更新和发布时，必须有发布记录和`git`上`tag`，及`api`变化记录文档的`changelog`。

## 16 不要频繁操作data中的数据
频繁的修改`data`中的数据会导致组件的重新渲染，影响性能。
```js
data() {
    return {
        count :0
    }
}
methods: {
    addCount() {
        let arr = [1,2,3,4,5  ]
        for(let i = 0; i < arr.length; i++) {
            this.count += arr[i];
        }
    }
}
```
应改写为
```js
data() {
    return {
        count :0
    }
}
methods: {
    addCount() {
        let arr = [1,2,3,4,5]；
        let num = 0;
        for(let i = 0; i < arr.length; i++) {
            num += arr[i];
        }
        this.count = num;
    }
}
```