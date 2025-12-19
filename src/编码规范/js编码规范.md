# JavaScript 编码规范

## 1 命名规范

### 1.1 基本命名风格
- **变量和函数**：使用驼峰命名法（camelCase）
  ```javascript
  const userName = "Zhang San";
  const getUserInfo = () => {};
  ```
- **常量**：使用全大写，单词间用下划线分隔
  ```javascript
  const MAX_RETRY_COUNT = 3;
  const API_ENDPOINT = "https://api.example.com";
  ```
- **类名**：使用帕斯卡命名法（PascalCase）
  ```javascript
  class UserService {
    // ...
  }
  ```
- **私有成员**：使用下划线前缀
  ```javascript
  class MyClass {
    constructor() {
      this._privateProperty = 42;
    }
    
    _privateMethod() {
      // ...
    }
  }
  ```

### 1.2 命名原则
- **具有描述性**：使用能准确表达变量或函数用途的名称
  ```javascript
  // 推荐
  const users = getUsersByRole("admin");
  
  // 避免
  const data = getInfo(1);
  ```
- **简洁明了**：在保持语义的前提下尽量简洁
  ```javascript
  // 推荐
  function formatDate(date) {}
  
  // 避免
  function formatTheProvidedDateWithStandardFormat(dateInput) {}
  ```
- **动词开头**：函数名通常以动词开头
  ```javascript
  function fetchUsers() {}
  function validateEmail(email) {}
  function calculateTotal(items) {}
  ```
- **布尔值**：使用 is/has/can/should 等前缀
  ```javascript
  const isLoading = true;
  const hasPermission = false;
  const canSubmit = true;
  const shouldValidate = false;
  ```

### 1.3 特殊命名规则
- **缩略词**：两个字母的缩略词全大写，三个以上字母的缩略词使用驼峰命名
  ```javascript
  const IOOperation = {};
  const httpRequest = {};
  const AppID = "123";
  ```
- **映射对象**：使用 by 连接键和值的描述
  ```javascript
  const usersById = {};
  const productsByName = {};
  ```

## 2 变量声明与赋值

### 2.1 声明方式
- **优先使用 const**：对于不变的值，使用 const 声明
- **按需使用 let**：对于需要重新赋值的变量，使用 let
- **禁止使用 var**：避免使用 var 声明变量，防止变量提升和作用域问题

```javascript
// 推荐
const PI = 3.14159;
let count = 0;
count += 1;

// 避免
var name = "John";
```

### 2.2 解构赋值
- **对象解构**：使用解构赋值提高代码可读性
  ```javascript
  // 推荐
  const { name, age } = user;
  
  // 避免
  const name = user.name;
  const age = user.age;
  ```
- **数组解构**：使用数组解构处理数组元素
  ```javascript
  // 推荐
  const [first, second] = items;
  
  // 避免
  const first = items[0];
  const second = items[1];
  ```
- **默认值**：使用解构时添加默认值
  ```javascript
  const { name = "Unknown", age = 0 } = user;
  const [first = null, second] = items;
  ```

## 3 函数规范

### 3.1 函数定义
- **优先使用箭头函数**：对于非方法函数，优先使用箭头函数
  ```javascript
  const sum = (a, b) => a + b;
  ```
- **函数表达式**：对于需要引用自身的函数，使用命名函数表达式
  ```javascript
  const factorial = function fact(n) {
    return n <= 1 ? 1 : n * fact(n - 1);
  };
  ```
- **函数参数**：
  - 限制参数数量，一般不超过3个
  - 超过3个参数时，使用对象参数
  - 为参数设置默认值

```javascript
// 推荐
function getUserInfo(userId, options = { includePermissions: false, includeProfile: true }) {
  // ...
}

// 避免
function getUserInfo(userId, includePermissions, includeProfile, forceRefresh, maxAge) {
  // ...
}
```

### 3.2 函数返回值
- **一致的返回类型**：函数应始终返回同一类型的值
- **早期返回**：使用早期返回模式简化逻辑
  ```javascript
  // 推荐
  function validateUser(user) {
    if (!user) return false;
    if (!user.email) return false;
    // 验证通过的逻辑
    return true;
  }
  ```
- **链式调用**：对象方法可以返回 this 以支持链式调用

### 3.3 纯函数
- **尽量编写纯函数**：相同输入总是产生相同输出，无副作用
  ```javascript
  // 纯函数
  const add = (a, b) => a + b;
  
  // 非纯函数
  let total = 0;
  const addToTotal = (value) => { total += value; return total; };
  ```

## 4 数据结构与操作

### 4.1 数组操作
- **使用数组方法**：优先使用数组内置方法而非 for 循环
  ```javascript
  // 推荐
  const doubled = numbers.map(n => n * 2);
  const evenNumbers = numbers.filter(n => n % 2 === 0);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  ```
- **展开语法**：使用展开语法操作数组
  ```javascript
  const newArray = [...oldArray, newValue];
  const copy = [...array];
  ```
- **数组解构**：使用解构语法从数组中提取元素

### 4.2 对象操作
- **简写属性**：使用对象属性简写
  ```javascript
  const name = "John";
  const user = { name, age: 30 }; // 等同于 { name: name, age: 30 }
  ```
- **计算属性名**：使用计算属性名
  ```javascript
  const key = "name";
  const user = { [key]: "John" };
  ```
- **展开语法**：使用展开语法合并和复制对象
  ```javascript
  const updatedUser = { ...user, age: 31 };
  const copy = { ...original };
  ```
- **可选链**：使用可选链操作符处理可能为 undefined 的属性
  ```javascript
  const name = user?.address?.city;
  ```
- **空值合并操作符**：使用空值合并操作符提供默认值
  ```javascript
  const name = user.name ?? "Anonymous";
  ```

## 5 异步编程

### 5.1 Promise 规范
- **链式调用**：使用 Promise 链式调用处理异步操作
  ```javascript
  fetchData()
    .then(processData)
    .then(displayResults)
    .catch(handleError);
  ```
- **Promise.all/race**：使用 Promise.all 并行处理多个异步操作
  ```javascript
  Promise.all([fetchUsers(), fetchProducts()])
    .then(([users, products]) => {
      // 处理结果
    });
  ```

### 5.2 async/await 规范
- **优先使用 async/await**：使用 async/await 简化异步代码
  ```javascript
  async function getUserWithPosts(userId) {
    try {
      const user = await fetchUser(userId);
      const posts = await fetchPosts(userId);
      return { user, posts };
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  }
  ```
- **错误处理**：在 async 函数中使用 try/catch 捕获错误
- **避免阻塞**：对于可以并行的异步操作，使用 Promise.all
  ```javascript
  async function getDashboardData() {
    const [users, products, orders] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders()
    ]);
    return { users, products, orders };
  }
  ```

## 6 控制流程

### 6.1 条件语句
- **花括号使用**：多行控制结构必须使用花括号，单行控制结构可以省略花括号，但风格必须保持一致
- **花括号风格**：所有花括号不换行，与前一行代码保持在同一行（K&R 风格）
  ```javascript
  // 推荐 - 多行必须使用花括号
  if (condition) {
    doSomething();
    doSomethingElse();
  }
  
  // 单行可以省略花括号
  if (condition) doSomething();
  
  // 或者保持使用花括号（保持团队一致性）
  if (condition) { doSomething(); }
  ```
- **条件语句简化**：简单的条件判断可以使用逻辑运算符或三元运算符替代
  ```javascript
  // 使用 || 设置默认值
  function process(value) {
    const data = value || defaultValue;
      // ...
   }
  
  
  // 使用 && 替代简单的 if 语句
  condition && doSomething();
  
  // 使用逻辑运算符进行前置检查
  function safeOperation(obj) {
    obj && obj.property && obj.property.method();
  }
  
  // 使用 || 进行空值检查
  function getData(input) {
    return input || 'default';
  }
  
  // 使用逻辑运算符组合条件
  function validate(value) {
    return value !== undefined && value !== null && value.length > 0;
  }
  
  // 使用三元运算符替代简单的 if-else
  const result = condition ? value1 : value2;
  ```
- **早期返回**：使用早期返回简化嵌套条件
  ```javascript
  function processData(data) {
    if (!data) return null;
    if (!data.valid) return invalidResult;
    
    // 处理有效数据
    return processedResult;
  }
  ```
- **严格相等**：使用 === 和 !== 进行比较，避免类型转换
- **空值检查**：使用简洁的方式检查空值
  ```javascript
  // 推荐
  if (!value) {}
  if (value) {}
  
  // 对于需要区分 null 和 undefined 的情况
  if (value === null) {}
  if (value === undefined) {}
  ```

### 6.2 循环语句
- **优先使用迭代方法**：对于数组，优先使用 map, filter, reduce 等方法
- **花括号风格**：所有花括号不换行，与前一行代码保持在同一行（K&R 风格）
- **for...of**：对于可迭代对象，使用 for...of
  ```javascript
  for (const item of items) {
    processItem(item);
  }
  ```
- **break 和 continue**：在不需要继续遍历时使用 break 或 continue

### 6.3 switch 语句
- **添加 default**：每个 switch 语句必须包含 default 分支
- **使用花括号**：每个 case 分支使用花括号包裹
- **使用 return 或 break**：确保每个 case 分支正确终止
  ```javascript
  switch (value) {
    case 'a': {
      // 处理 a
      break;
    }
    case 'b': {
      // 处理 b
      break;
    }
    default: {
      // 处理默认情况
    }
  }
  ```

## 7 错误处理

### 7.1 异常捕获
- **try/catch**：使用 try/catch 捕获可预见的异常
  ```javascript
  try {
    const data = JSON.parse(jsonString);
  } catch (error) {
    console.error("Invalid JSON:", error);
  }
  ```
- **自定义错误**：创建有意义的自定义错误类型
  ```javascript
  class ValidationError extends Error {
    constructor(message, field) {
      super(message);
      this.name = "ValidationError";
      this.field = field;
    }
  }
  ```

### 7.2 错误传递
- **适当抛出错误**：在适当的时机抛出错误，而不是隐藏它们
- **错误信息**：提供清晰、有帮助的错误信息
- **日志记录**：记录关键错误以便调试

## 8 性能优化

### 8.1 避免不必要的计算
- **缓存计算结果**：对于重复使用的计算结果进行缓存
  ```javascript
  // 推荐
  function processItems(items) {
    return items.map(item => {
      const expensiveValue = calculateExpensiveValue(item);
      return {
        ...item,
        value1: expensiveValue * 2,
        value2: expensiveValue * 3
      };
    });
  }
  ```

### 8.2 内存优化
- **避免内存泄漏**：
  - 清理事件监听器
  - 避免不必要的全局变量
  - 管理定时器引用
  ```javascript
  // 在组件卸载时清理事件监听器
  useEffect(() => {
    const handleResize = () => {};
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  ```
- **使用 WeakMap/WeakSet**：对于缓存大型对象，考虑使用 WeakMap 或 WeakSet

## 9 模块化

### 9.1 ES 模块
- **使用 import/export**：使用 ES 模块语法进行模块化开发
  ```javascript
  // 导出
  export const utils = {};
  export default class UserService {};
  
  // 导入
  import UserService, { utils } from './services';
  ```
- **按需导入**：只导入需要的模块，避免导入整个库
  ```javascript
  // 推荐
  import { debounce } from 'lodash-es';
  
  // 避免
  import _ from 'lodash';
  ```

### 9.2 模块设计原则
- **单一职责**：每个模块只负责一个功能
- **小而美**：保持模块体积小，易于维护
- **可重用性**：设计可重用的模块

## 10 代码格式化

### 10.1 缩进与空格
- **使用空格**：使用 2 个空格进行缩进
- **花括号风格**：所有花括号不换行，与前一行代码保持在同一行（K&R 风格）
  ```javascript
  // 推荐 - 不换行的花括号风格
  function example() {
    // 代码
  }
  
  if (condition) {
    // 代码
  }
  
  for (let i = 0; i < 10; i++) {
    // 代码
  }
  ```
- **花括号间距**：花括号内使用空格
  ```javascript
  const obj = { key: 'value' };
  ```
- **运算符周围**：运算符两侧使用空格
  ```javascript
  const sum = a + b;
  ```

### 10.2 换行与长度
- **最大行长度**：限制单行代码长度，通常为 80-100 个字符
- **适当换行**：在较长的表达式或链式调用中进行适当换行
  ```javascript
  fetchData()
    .then(processData)
    .then(filterResults)
    .then(displayOutput);
  ```

### 10.3 分号
- **一致使用**：项目中统一使用或不使用分号
- **推荐使用**：为避免自动插入分号（ASI）可能导致的问题，推荐使用分号

## 11 注释规范

### 11.1 注释类型
- **单行注释**：使用 // 注释单行
- **多行注释**：使用 /* */ 注释多行
- **JSDoc**：使用 JSDoc 格式注释函数和类
  ```javascript
  /**
   * 计算两个数的和
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 两数之和
   */
  function sum(a, b) {
    return a + b;
  }
  ```

### 11.2 注释原则
- **必要时添加**：只在需要解释复杂逻辑或非显而易见的地方添加注释
- **保持更新**：确保注释与代码同步更新
- **TODO 注释**：使用 TODO 标记待办事项
  ```javascript
  // TODO: 优化此函数的性能
  ```

## 12 最佳实践与常见错误

### 12.1 DOM 操作规范
- **推荐实践**：
  - 使用事件委托处理多个相似元素
  - 批量修改 DOM 以减少重排
  - 使用 DocumentFragment 在内存中构建 DOM
- **避免做法**：
  - 在现代前端框架中使用 jQuery 操作 DOM
  - 直接操作 DOM 而不通过框架提供的方式
  ```javascript
  // 避免
  $("#elementId").css({ display: "flex" });
  
  // 推荐 (React)
  const elementRef = useRef(null);
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.style.display = 'flex';
    }
  }, []);
  ```

### 12.2 安全与性能
- **安全考虑**：
  - 对用户输入进行验证和转义（XSS 防护）
  - 避免使用 eval() 和 Function 构造函数
  - 优先使用 HTTPS 请求

### 12.3 ES6+ 特性使用
- **变量声明**：使用 const 和 let 代替 var，利用块级作用域特性
- **函数表达式**：使用箭头函数简化代码，避免使用 that = this
  ```javascript
  // 避免
  var that = this;
  setTimeout(function() {
    that.doSomething();
  }, 1000);
  
  // 推荐
  setTimeout(() => {
    this.doSomething();
  }, 1000);
  ```
- **字符串处理**：使用模板字符串代替字符串拼接
  ```javascript
  const greeting = `Hello, ${userName}!`;
  ```

### 12.4 异步处理规范
- **必须包含错误处理**：所有异步操作（Promise、async/await）必须有错误处理
- **避免空的 catch 块**：catch 块必须包含错误处理逻辑
  ```javascript
  // 避免
  try {
    const json = localStorage.getItem('key');
    const data = JSON.parse(json);
  } catch (e) {
    // 空的 catch 块
  }
  
  // 推荐
  try {
    const json = localStorage.getItem('key');
    const data = JSON.parse(json);
  } catch (e) {
    console.error('解析数据失败:', e);
    // 处理错误
  }
  ```

### 12.5 组件与状态管理
- **组件规模控制**：单个组件不应超过 500 行代码
- **职责单一原则**：将复杂组件拆分为多个功能单一的小组件
- **状态管理**：
  - 避免过多的状态变量
  - 永远不要直接修改 state 对象，应该使用 setState 方法
  ```javascript
  // 避免
  this.state.isLoading = true;
  
  // 推荐
  this.setState({ isLoading: true });
  ```
  - 使用状态管理库或自定义 Hook 管理复杂状态

### 12.6 代码组织和风格
- **一致的函数声明**：保持函数声明风格一致（箭头函数或函数声明）
- **合理的命名**：使用有意义的变量和函数名
- **添加必要注释**：为复杂逻辑添加注释说明
- **避免重复代码**：提取重复逻辑为可复用函数

### 12.7 条件判断和循环优化
- **避免嵌套过深**：条件判断和循环嵌套不应超过 3 层
- **使用早期返回**：减少嵌套层级，提高代码可读性
  ```javascript
  // 避免
  function process(data) {
    if (data) {
      if (data.status) {
        if (data.status === 'active') {
          // 处理逻辑
        }
      }
    }
  }
  
  // 推荐
  function process(data) {
    if (!data || !data.status) return;
    
    if (data.status === 'active') {
      // 处理逻辑
    }
  }
  ```
