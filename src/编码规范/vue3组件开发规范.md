## 1 组件样式 style 标签必须加 scoped 属性

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

## 3 Composition API 优先使用 setup 语法糖

推荐使用 `<script setup>` 语法糖，简化组件开发：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)
</script>
```

## 4 使用组合式函数（Composables）组织逻辑

将可复用的逻辑封装为组合式函数，提高代码可维护性：

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  return {
    count,
    increment,
    decrement
  }
}

// 在组件中使用
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment, decrement } = useCounter(10)
</script>
```

## 5 响应式数据使用规范

- 使用 `ref` 定义基本类型和复杂类型的响应式数据
- 使用 `reactive` 定义对象类型的响应式数据
- 避免直接修改 `props`，使用 `toRefs` 解构 props

```typescript
// 推荐方式
const props = defineProps<{
  user: { name: string; age: number }
}>()

// 解构并保持响应式
const { user } = toRefs(props)

// 计算属性派生新数据
const userName = computed(() => user.value.name)
```

## 6 组件通信方式

### 6.1 父子组件通信

- 使用 `defineProps` 和 `defineEmits`
- 使用 `defineExpose` 暴露组件内部方法

```vue
<script setup>
// 定义 props
const props = defineProps<{
  title: string
}>()

// 定义 emits
const emit = defineEmits<{
  (e: 'update:title', value: string): void
}>()

// 暴露方法给父组件
const refresh = () => {
  console.log('刷新组件')
}

defineExpose({
  refresh
})
</script>
```

### 6.2 跨组件通信

- 使用 `provide` 和 `inject`
- 使用状态管理库（Pinia/Vuex）管理全局状态

## 7 模板中避免复杂表达式

将复杂逻辑移至 `<script setup>` 中的计算属性或方法：

```vue
<script setup>
import { computed } from 'vue'

const props = defineProps<{
  items: Array<{ id: number; name: string; active: boolean }>
}>()

// 计算属性替代复杂表达式
const activeCount = computed(() => {
  return props.items.filter(item => item.active).length
})
</script>

<template>
  <!-- 好的做法 -->
  <div>激活数量：{{ activeCount }}</div>
  
  <!-- 避免的做法 -->
  <!-- <div>激活数量：{{ items.filter(item => item.active).length }}</div> -->
</template>
```

## 8 性能优化

### 8.1 使用 `shallowRef` 和 `shallowReactive`

对于不需要深度响应式的数据，使用浅层响应式API提高性能：

```typescript
// 大型数据对象，只需监听引用变化
const largeData = shallowRef({ /* 大量数据 */ })
```

### 8.2 使用 `toRaw` 获取原始对象

在不需要响应式的场景下，使用原始对象操作：

```typescript
import { toRaw } from 'vue'

// 避免不必要的响应式开销
const rawData = toRaw(reactiveData)
// 对 rawData 进行大量操作
```

### 8.3 使用 `v-memo` 减少不必要的重新渲染

```vue
<div v-for="item in items" :key="item.id" v-memo="[item.id, item.name]">
  {{ item.name }}
</div>
```

## 9 异步组件和代码分割

使用异步组件实现代码分割，减少初始加载体积：

```vue
<script setup>
// 动态导入，按需加载
const AsyncComponent = defineAsyncComponent(() => import('./HeavyComponent.vue'))
</script>

<template>
  <AsyncComponent />
</template>
```

## 10 生命周期钩子的使用

在 Composition API 中使用生命周期钩子：

```typescript
import { onMounted, onUnmounted, watch } from 'vue'

onMounted(() => {
  // 组件挂载后执行
})

onUnmounted(() => {
  // 组件卸载前执行，清理副作用
})

// 监听响应式数据变化
watch(() => props.id, (newId, oldId) => {
  // 处理 id 变化
})
```

## 11 组件内的样式命名

必须将组件名字作为组件内`css`样式类的命名空间。
例如：组件名叫`my-component`,组件内部的 css 样式命名：`.my-component`、 `.my-component-item`等

## 12 TypeScript 类型定义

### 12.1 Props 和 Emits 的类型定义

```typescript
// 使用泛型语法定义 props 类型
const props = defineProps<{
  id: number
  title: string
  disabled?: boolean
}>()

// emits 类型定义
const emit = defineEmits<{
  (e: 'submit', data: { name: string; age: number }): void
  (e: 'cancel'): void
}>()
```

### 12.2 接口和类型定义

将共享的类型定义放在单独的文件中：

```typescript
// types/user.ts
export interface User {
  id: number
  name: string
  email: string
}

// 在组件中使用
import type { User } from '@/types/user'

const user = ref<User>({ id: 1, name: '张三', email: 'zhangsan@example.com' })
```

## 13 避免在组件中使用 this.$parent

如果在组件中使用`this.$parent`，这样组件只能在含有特定上下文的父组件使用，不利于长期维护和复用。在 Vue 3 中，应使用 props 和 emit 或 provide/inject 代替。

## 14 组件属性名字应避开 class、style 等原生 dom 节点属性名字

`prop`属性应避开`class`、`style`等原生`dom`节点属性的名字，以免组件使用者想添加相关原生属性时不生效。

## 15 外部依赖必须在 package.json 文件中写明

## 16 组件相关文档

组件开发完后必须提供组件的`api`文档、组件使用文档、有详细介绍的`readme`，及，当组件进行版本更新和发布时，必须有发布记录和`git`上`tag`，及`api`变化记录文档的`changelog`。

## 17 使用 Teleport 处理 DOM 结构

对于模态框、通知等组件，使用 Teleport 将内容渲染到 DOM 其他位置：

```vue
<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="modal-content">
        <!-- 模态框内容 -->
      </div>
    </div>
  </Teleport>
</template>
```

## 18 使用 Suspense 处理异步组件

配合异步组件使用 Suspense 提供更好的用户体验：

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

## 19 DOM 操作规范

### 19.1 禁止使用 jQuery 操作节点

- **绝对禁止**在 Vue 3 项目中使用 jQuery 进行 DOM 操作
- jQuery 直接操作 DOM 会绕过 Vue 的响应式系统，导致状态与视图不一致
- Vue 提供了声明式的数据绑定和组件系统，不需要直接操作 DOM

### 19.2 Vue 3 推荐的 DOM 操作方式

- 使用 Vue 的响应式数据驱动视图更新
- 对于需要直接 DOM 引用的场景，使用模板引用（template refs）
- 使用 Vue 提供的过渡系统处理动画效果

```vue
<template>
  <div>
    <input ref="inputRef" />
    <button @click="focusInput">聚焦输入框</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 使用模板引用获取 DOM 元素
const inputRef = ref(null)

const focusInput = () => {
  inputRef.value?.focus()
}
</script>

// 避免使用 jQuery
// 错误示例
// $(.my-element).addClass('active')
// $(.my-element).fadeIn()

// 推荐使用 Vue 的过渡系统替代 jQuery 动画
<template>
  <Transition name="fade">
    <div v-if="show" class="element">内容</div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
  }
</style>