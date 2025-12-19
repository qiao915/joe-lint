# Vue开发规范

## 1 概述

本规范定义了Vue.js项目的开发规范，适用于所有使用Vue 3的项目。规范基于Vue 3的最佳实践和行业标准，包括组件设计、模板语法、属性规范、指令使用、代码风格等内容。

## 2 基础规范

### 2.1 文件扩展名
- **规则**：Vue组件文件使用`.vue`扩展名
- **配置**：无需额外配置
  ```vue
  <!-- 推荐 -->
  User.vue
  ProductList.vue
  
  <!-- 避免 -->
  User.js
  ProductList.js
  ```

### 2.2 编码格式
- **规则**：使用UTF-8编码
- **配置**：无需额外配置

### 2.3 语法版本
- **规则**：使用Vue 3语法
- **配置**：`"extends": ["eslint:recommended", "plugin:vue/vue3-recommended"]`

## 3 组件规范

### 3.1 组件命名
- **规则**：组件名使用PascalCase命名法
- **配置**：`"vue/component-options-name-casing": ["error", "camelCase"]`
  ```vue
  <!-- 推荐 -->
  <template>
    <UserProfile />
    <ProductList />
  </template>
  
  <!-- 避免 -->
  <template>
    <user-profile />
    <product_list />
  </template>
  ```

### 3.2 组件结构
- **规则**：组件文件包含template、script、style三个部分，顺序为template -> script -> style
- **配置**：`"vue/block-order": ["error", { "order": ["template", "script", "style"] }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <!-- 模板内容 -->
  </template>
  
  <script>
  // 脚本内容
  </script>
  
  <style scoped>
  /* 样式内容 */
  </style>
  
  <!-- 避免 -->
  <script>
  // 脚本内容
  </script>
  
  <template>
    <!-- 模板内容 -->
  </template>
  
  <style>
  /* 样式内容 */
  </style>
  ```

### 3.3 组件属性
- **规则**：组件必须定义name属性和props属性
- **配置**：`"vue/require-name-property": "error"`, `"vue/require-prop-types": "error"`
  ```vue
  <!-- 推荐 -->
  <script>
  export default {
    name: 'UserProfile',
    props: {
      userId: {
        type: Number,
        required: true
      },
      userName: {
        type: String,
        default: ''
      }
    }
  }
  </script>
  
  <!-- 避免 -->
  <script>
  export default {
    props: {
      userId: Number,
      userName: String
    }
  }
  </script>
  ```

### 3.4 组件注册
- **规则**：禁止使用未注册的组件，禁止使用未使用的组件
- **配置**：`"vue/no-unregistered-components": "error"`, `"vue/no-unused-components": "error"`
  ```vue
  <!-- 推荐 -->
  <script>
  import UserProfile from './UserProfile.vue'
  
  export default {
    components: {
      UserProfile
    }
  }
  </script>
  
  <template>
    <UserProfile />
  </template>
  
  <!-- 避免 -->
  <script>
  import UserProfile from './UserProfile.vue'
  
  export default {
    components: {
      UserProfile
    }
  }
  </script>
  
  <template>
    <!-- 未使用UserProfile组件 -->
  </template>
  ```

## 4 模板规范

### 4.1 根元素
- **规则**：模板必须有且只有一个根元素
- **配置**：`"vue/valid-template-root": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <div>
      <h1>标题</h1>
      <p>内容</p>
    </div>
  </template>
  
  <!-- 避免 -->
  <template>
    <h1>标题</h1>
    <p>内容</p>
  </template>
  ```

### 4.2 标签闭合
- **规则**：所有标签必须正确闭合，自闭合标签必须使用自闭合语法
- **配置**：`"vue/no-unclosed-tags": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <div></div>
    <input type="text" />
    <img src="image.jpg" />
  </template>
  
  <!-- 避免 -->
  <template>
    <div>
    <input type="text">
    <img src="image.jpg">
  </template>
  ```

### 4.3 属性引号
- **规则**：HTML属性值使用双引号
- **配置**：`"vue/html-quotes": ["error", "double"]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div class="container">
      <input type="text" placeholder="请输入内容">
    </div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div class='container'>
      <input type='text' placeholder='请输入内容'>
    </div>
  </template>
  ```

### 4.4 属性数量
- **规则**：单行最多5个属性，多行时每行1个属性
- **配置**：`"vue/max-attributes-per-line": ["error", { "singleline": 5, "multiline": 1 }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <!-- 单行属性（不超过5个） -->
    <UserProfile id="user-1" name="张三" age="25" gender="male" role="admin" />
    
    <!-- 多行属性（超过5个） -->
    <UserProfile
      id="user-1"
      name="张三"
      age="25"
      gender="male"
      role="admin"
      email="zhangsan@example.com"
      phone="1234567890"
    />
  </template>
  
  <!-- 避免 -->
  <template>
    <!-- 单行属性（超过5个） -->
    <UserProfile id="user-1" name="张三" age="25" gender="male" role="admin" email="zhangsan@example.com" phone="1234567890" />
  </template>
  ```

## 5 属性规范

### 5.1 属性命名
- **规则**：HTML属性和组件属性使用连字符命名法（kebab-case），忽略特殊属性如vModel、vBind、vOn等
- **配置**：`"vue/attribute-hyphenation": ["error", "always", {"ignore": ["vModel", "vBind", "vOn", "vSlot", "uploadUrl", "dialogVisible", "formItemLayout", "customProp"]}]`
  ```vue
  <!-- 推荐 -->
  <template>
    <UserProfile user-id="1" user-name="张三" />
    <button @click="handleClick" class="primary-btn">点击</button>
  </template>
  
  <!-- 避免 -->
  <template>
    <UserProfile userId="1" userName="张三" />
    <button @click="handleClick" class="primaryBtn">点击</button>
  </template>
  ```

### 5.2 重复属性
- **规则**：禁止重复的属性，允许class和style属性重复
- **配置**：`"vue/no-duplicate-attributes": ["error", { "allowCoexistClass": true, "allowCoexistStyle": true }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div class="container main">
      <div :class="['item', { active: isActive }]"></div>
    </div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div class="container" class="main">
      <div id="item" id="another-item"></div>
    </div>
  </template>
  ```

### 5.3 保留属性
- **规则**：禁止使用Vue保留的属性名
- **配置**：`"vue/no-reserved-keys": ["error", { "reservedKeys": ["key", "ref", "slot", "slot-scope", "scoped-slot"] }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div :data-key="item.id"></div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div :key="item.id"></div>
  </template>
  ```

## 6 指令规范

### 6.1 基本指令

#### 6.1.1 v-bind
- **规则**：禁止使用无效的v-bind指令
- **配置**：`"vue/no-invalid-v-bind": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <div :class="{ active: isActive }" :style="{ color: textColor }"></div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div :class="{ active: isActive }" :style="{ color: textColor, invalidProperty: 'value' }"></div>
  </template>
  ```

#### 6.1.2 v-on
- **规则**：禁止使用无效的v-on指令
- **配置**：`"vue/no-invalid-v-on": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <button @click="handleClick" @mouseover="handleMouseOver"></button>
  </template>
  
  <!-- 避免 -->
  <template>
    <button @click="handleClick" @invalid-event="handleInvalid"></button>
  </template>
  ```

#### 6.1.3 v-for
- **规则**：禁止使用无效的v-for指令，禁止在v-for中使用v-if
- **配置**：`"vue/no-invalid-v-for": ["error", { "allowUsingIterationVarInIf": false }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div v-for="item in items" :key="item.id">
      <div v-if="item.active">{{ item.name }}</div>
    </div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div v-for="item in items" v-if="item.active" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  ```

#### 6.1.4 v-model
- **规则**：禁止使用无效的v-model指令
- **配置**：`"vue/no-invalid-v-model": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <input v-model="message" type="text" />
    <textarea v-model="content"></textarea>
  </template>
  
  <!-- 避免 -->
  <template>
    <div v-model="data"></div>
  </template>
  ```

### 6.2 指令简写

#### 6.2.1 v-bind简写
- **规则**：推荐使用v-bind的简写形式（:attr）
- **配置**：`"vue/v-bind-style": ["error", "shorthand"]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div :class="{ active: isActive }" :style="{ color: textColor }"></div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div v-bind:class="{ active: isActive }" v-bind:style="{ color: textColor }"></div>
  </template>
  ```

#### 6.2.2 v-on简写
- **规则**：推荐使用v-on的简写形式（@event）
- **配置**：`"vue/v-on-style": ["error", "shorthand"]`
  ```vue
  <!-- 推荐 -->
  <template>
    <button @click="handleClick" @mouseover="handleMouseOver"></button>
  </template>
  
  <!-- 避免 -->
  <template>
    <button v-on:click="handleClick" v-on:mouseover="handleMouseOver"></button>
  </template>
  ```

## 7 脚本规范

### 7.1 基本语法
- **规则**：遵循JavaScript/TypeScript的基础语法规范
- **配置**：继承自base规则

### 7.2 响应式数据
- **规则**：使用Composition API的ref和reactive定义响应式数据
- **配置**：无需额外配置
  ```vue
  <!-- 推荐 -->
  <script setup>
  import { ref, reactive } from 'vue'
  
  const count = ref(0)
  const user = reactive({
    name: '张三',
    age: 25
  })
  </script>
  
  <!-- 避免 -->
  <script>
  export default {
    data() {
      return {
        count: 0,
        user: {
          name: '张三',
          age: 25
        }
      }
    }
  }
  </script>
  ```

### 7.3 计算属性
- **规则**：计算属性必须有return语句
- **配置**：`"vue/return-in-computed-property": "error"`
  ```vue
  <!-- 推荐 -->
  <script setup>
  import { computed, ref } from 'vue'
  
  const count = ref(0)
  const doubleCount = computed(() => {
    return count.value * 2
  })
  </script>
  
  <!-- 避免 -->
  <script setup>
  import { computed, ref } from 'vue'
  
  const count = ref(0)
  const doubleCount = computed(() => {
    count.value * 2 // 缺少return
  })
  </script>
  ```

### 7.4 事件处理
- **规则**：事件处理函数使用handle前缀
- **配置**：无需额外配置
  ```vue
  <!-- 推荐 -->
  <script setup>
  import { ref } from 'vue'
  
  const count = ref(0)
  
  const handleClick = () => {
    count.value++
  }
  </script>
  
  <template>
    <button @click="handleClick">{{ count }}</button>
  </template>
  
  <!-- 避免 -->
  <script setup>
  import { ref } from 'vue'
  
  const count = ref(0)
  
  const click = () => {
    count.value++
  }
  </script>
  
  <template>
    <button @click="click">{{ count }}</button>
  </template>
  ```

## 8 代码风格

### 8.1 缩进
- **规则**：模板和脚本使用2个空格进行缩进
- **配置**：`"vue/html-indent": ["error", 2]`, `"indent": ["error", 2]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div class="container">
      <h1>标题</h1>
      <p>内容</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
    setup() {
      const count = 0
      return {
        count
      }
    }
  }
  </script>
  
  <!-- 避免 -->
  <template>
      <div class="container">
          <h1>标题</h1>
          <p>内容</p>
      </div>
  </template>
  
  <script>
  export default {
      name: 'App',
      setup() {
          const count = 0
          return {
              count
          }
      }
  }
  </script>
  ```

### 8.2 空格
- **规则**：禁止多个空格
- **配置**：`"vue/no-multi-spaces": "error"`
  ```vue
  <!-- 推荐 -->
  <template>
    <div class="container">
      <h1>标题</h1>
      <p>内容</p>
    </div>
  </template>
  
  <!-- 避免 -->
  <template>
    <div   class="container">
      <h1>  标题  </h1>
      <p>内容</p>
    </div>
  </template>
  ```

### 8.3 标签空格
- **规则**：标签闭合括号的空格规则
- **配置**：`"vue/html-closing-bracket-spacing": ["error", { "startTag": "never", "endTag": "never", "selfClosingTag": "always" }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div class="container"></div>
    <input type="text" />
  </template>
  
  <!-- 避免 -->
  <template>
    <div class="container" ></div>
    <input type="text"/>
  </template>
  ```

### 8.4 标签换行
- **规则**：单行标签闭合括号不换行，多行标签闭合括号换行
- **配置**：`"vue/html-closing-bracket-newline": ["error", { "singleline": "never", "multiline": "always" }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <UserProfile name="张三" age="25" />
    
    <UserProfile
      name="张三"
      age="25"
      gender="male"
    />
  </template>
  
  <!-- 避免 -->
  <template>
    <UserProfile name="张三" age="25"
    />
    
    <UserProfile
      name="张三"
      age="25"
      gender="male" />
  </template>
  ```

## 9 最佳实践

### 9.1 使用Composition API
- **规则**：优先使用Composition API（setup script）
- **配置**：无需额外配置
  ```vue
  <!-- 推荐 -->
  <template>
    <div>{{ count }}</div>
    <button @click="handleClick">点击</button>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const count = ref(0)
  
  const handleClick = () => {
    count.value++
  }
  </script>
  
  <!-- 避免 -->
  <template>
    <div>{{ count }}</div>
    <button @click="handleClick">点击</button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        count: 0
      }
    },
    methods: {
      handleClick() {
        this.count++
      }
    }
  }
  </script>
  ```

### 9.2 避免过度使用v-if和v-for
- **规则**：避免在同一元素上同时使用v-if和v-for
- **配置**：`"vue/no-invalid-v-for": ["error", { "allowUsingIterationVarInIf": false }]`
  ```vue
  <!-- 推荐 -->
  <template>
    <div v-for="item in activeItems" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  
  const items = ref([
    { id: 1, name: 'Item 1', active: true },
    { id: 2, name: 'Item 2', active: false },
    { id: 3, name: 'Item 3', active: true }
  ])
  
  const activeItems = computed(() => {
    return items.value.filter(item => item.active)
  })
  </script>
  
  <!-- 避免 -->
  <template>
    <div v-for="item in items" v-if="item.active" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  ```

### 9.3 使用Prop Types
- **规则**：为组件的props定义类型和默认值
- **配置**：`"vue/require-prop-types": "error"`
  ```vue
  <!-- 推荐 -->
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    userId: {
      type: Number,
      required: true
    },
    userName: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      default: 0
    }
  })
  </script>
  
  <!-- 避免 -->
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps(['userId', 'userName', 'age'])
  </script>
  ```

## 10 代码示例

### 10.1 符合规范的组件

```vue
<template>
  <div class="user-profile">
    <h2>{{ userInfo.name }}</h2>
    <p>年龄：{{ userInfo.age }}</p>
    <p>邮箱：{{ userInfo.email }}</p>
    
    <div class="actions">
      <button @click="handleEdit" class="edit-btn">编辑</button>
      <button @click="handleDelete" class="delete-btn">删除</button>
    </div>
    
    <UserPosts 
      :user-id="userInfo.id" 
      :posts="posts"
      @post-click="handlePostClick"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import UserPosts from './UserPosts.vue'

// 定义props
const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

// 定义响应式数据
const userInfo = reactive({
  id: props.userId,
  name: '',
  age: 0,
  email: ''
})

const posts = ref([])
const loading = ref(false)

// 计算属性
const isAdult = computed(() => {
  return userInfo.age >= 18
})

// 方法
const fetchUserInfo = async () => {
  loading.value = true
  try {
    // 模拟API请求
    userInfo.name = '张三'
    userInfo.age = 25
    userInfo.email = 'zhangsan@example.com'
    
    posts.value = [
      { id: 1, title: '文章1', content: '内容1' },
      { id: 2, title: '文章2', content: '内容2' }
    ]
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  console.log('编辑用户:', userInfo.id)
}

const handleDelete = () => {
  console.log('删除用户:', userInfo.id)
}

const handlePostClick = (postId) => {
  console.log('点击文章:', postId)
}

// 初始化
fetchUserInfo()
</script>

<style scoped>
.user-profile {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.actions {
  margin: 10px 0;
}

.edit-btn {
  margin-right: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}

.delete-btn {
  background-color: #f56c6c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
```

### 10.2 不符合规范的组件

```vue
<template>
<div class="userProfile">
  <h2>{{ userName }}</h2>
  <p>年龄：{{ userAge }}</p>
  <p>邮箱：{{ userEmail }}</p>
  
  <div class="actions">
    <button @click="edit" class="editBtn">编辑</button>
    <button @click="delete" class="deleteBtn">删除</button>
  </div>
  
  <user-posts userId="userInfo.id" posts="posts" />
</div>
</template>

<script>
export default {
  name: 'userProfile',
  props: ['userId'],
  data() {
    return {
      userName: '',
      userAge: 0,
      userEmail: '',
      posts: []
    }
  },
  methods: {
    fetchData() {
      // 模拟API请求
      this.userName = '张三'
      this.userAge = 25
      this.userEmail = 'zhangsan@example.com'
      
      this.posts = [
        { id: 1, title: '文章1', content: '内容1' },
        { id: 2, title: '文章2', content: '内容2' }
      ]
    },
    edit() {
      console.log('编辑用户')
    },
    delete() {
      console.log('删除用户')
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style>
.userProfile {
  padding:20px;
  border:1px solid #eee;
  border-radius:4px;
}

.actions {
  margin:10px 0;
}

.editBtn {
  margin-right:10px;
  background-color:#409eff;
  color:white;
  border:none;
  padding:5px 10px;
  border-radius:4px;
}

.deleteBtn {
  background-color:#f56c6c;
  color:white;
  border:none;
  padding:5px 10px;
  border-radius:4px;
}
</style>
```

## 11 常见错误与避免方法

### 11.1 未定义的组件
- **错误**：使用未注册的组件
- **避免**：确保所有组件都已正确注册
  ```vue
  <!-- 错误 -->
  <template>
    <UserProfile />
  </template>
  
  <script setup>
  // 忘记导入和注册UserProfile组件
  </script>
  
  <!-- 正确 -->
  <template>
    <UserProfile />
  </template>
  
  <script setup>
  import UserProfile from './UserProfile.vue'
  </script>
  ```

### 11.2 无效的指令
- **错误**：使用无效的指令或指令语法
- **避免**：遵循Vue官方文档的指令语法
  ```vue
  <!-- 错误 -->
  <template>
    <div v-if="true">显示</div>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  
  <!-- 正确 -->
  <template>
    <div v-if="showContent">显示</div>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  ```

### 11.3 重复的属性
- **错误**：使用重复的属性
- **避免**：确保每个属性只使用一次，除了class和style属性
  ```vue
  <!-- 错误 -->
  <template>
    <div id="user" id="profile"></div>
  </template>
  
  <!-- 正确 -->
  <template>
    <div id="user-profile"></div>
  </template>
  ```

### 11.4 缺少key属性
- **错误**：在v-for中缺少key属性
- **避免**：为每个v-for项提供唯一的key属性
  ```vue
  <!-- 错误 -->
  <template>
    <div v-for="item in items">
      {{ item.name }}
    </div>
  </template>
  
  <!-- 正确 -->
  <template>
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </template>
  ```

## 12 总结

本规范定义了Vue.js项目的开发规范，包括组件设计、模板语法、属性规范、指令使用、代码风格等内容。遵循这些规范可以提高代码的可读性、可维护性和质量，减少潜在的错误和问题。