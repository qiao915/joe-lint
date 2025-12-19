# JavaScript 开发规范

## 1 概述

JavaScript 开发规范旨在确保 JavaScript 代码的一致性、可维护性和性能优化。本规范基于 ESLint 规则，涵盖了从基础语法到高级特性的全面编码标准。

## 2 基础规范

### 2.1 文件命名
- 文件名使用小写，单词间用短横线分隔
- 使用有意义的名称，反映文件的功能

```
// 推荐
user-service.js
utils/date-helper.js
components/button.js

// 避免
util.js
date.js
dateHelper.js
```

### 2.2 文件组织
- 按功能或模块组织文件
- 使用清晰的目录结构
- 保持文件大小合理（单文件不超过 800 行）

### 2.3 编码格式
- 使用 UTF-8 编码
- 缩进使用 2 个空格
- 行末不保留空格
- 文件末尾添加换行符

## 3 命名规范

### 3.1 变量命名
- 使用驼峰命名法（camelCase）
- 避免使用下划线开头
- 除了 _id，禁止标识符结尾有下划线

```javascript
// 推荐
const userName = '张三';
const isActive = true;
const _id = '123';

// 避免
const username = '张三';
const is_active = true;
const userName_ = '李四';
```

### 3.2 常量命名
- 使用全大写，单词间用下划线分隔

```javascript
// 推荐
const MAX_LENGTH = 100;
const API_URL = 'https://api.example.com';

// 避免
const maxLength = 100;
const apiUrl = 'https://api.example.com';
```

### 3.3 函数命名
- 使用驼峰命名法（camelCase）
- 使用动词开头，清晰描述函数功能

```javascript
// 推荐
function getUserData(id) { /* ... */ }
function calculateTotal(prices) { /* ... */ }
const validateEmail = (email) => { /* ... */ };

// 避免
function user(id) { /* ... */ }
function total(prices) { /* ... */ }
const email = (email) => { /* ... */ };
```

### 3.4 类命名
- 使用帕斯卡命名法（PascalCase）

```javascript
// 推荐
class UserService { /* ... */ }
class DataProcessor { /* ... */ }

// 避免
class userService { /* ... */ }
class data_processor { /* ... */ }
```

## 4 变量声明与赋值

### 4.1 变量声明
- 优先使用 `const`，其次是 `let`
- 禁止使用 `var`
- 变量声明放在作用域顶部

```javascript
// 推荐
const name = '张三';
let age = 25;

// 避免
var name = '张三';
name = '李四'; // 如果不需要重新赋值，应使用 const
```

### 4.2 解构赋值
- 优先使用解构赋值简化代码

```javascript
// 推荐
const { name, age } = user;
const [first, second] = array;

// 避免
const name = user.name;
const age = user.age;
const first = array[0];
const second = array[1];
```

### 4.3 赋值操作
- 禁止将变量赋值给自己
- 禁止在条件语句中使用赋值操作符

```javascript
// 推荐
if (isActive === true) { /* ... */ }

// 避免
if (isActive = true) { /* ... */ } // 错误：赋值而非比较
let x = x; // 错误：赋值给自己
```

## 5 函数规范

### 5.1 函数定义
- 优先使用箭头函数
- 函数名与赋值变量名匹配

```javascript
// 推荐
const getUserData = (id) => { /* ... */ };

// 避免
const getUserData = function(id) { /* ... */ };
function getUserData(id) { /* ... */ } // 如果不是全局函数，优先使用箭头函数
```

### 5.2 函数参数
- 函数参数数量不超过 3 个
- 默认参数放在参数列表的任意位置
- 禁止修改函数参数

```javascript
// 推荐
function createUser(name, age, role = 'user') { /* ... */ }

// 避免
function createUser(name, age, email, phone, address, city, country) { /* ... */ } // 参数过多
function updateUser(user) {
  user.name = '新名称'; // 错误：修改函数参数
}
```

### 5.3 函数返回值
- 保持返回值类型一致
- 使用早期返回简化逻辑
- 不要求函数中每个分支都有返回值

```javascript
// 推荐
function validateUser(user) {
  if (!user) return false;
  if (!user.name) return false;
  return true;
}

// 避免
function validateUser(user) {
  if (user) {
    if (user.name) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
```

## 6 数据结构与操作

### 6.1 数组操作
- 使用数组方法（如 map, filter, reduce）替代 for 循环
- 确保数组回调函数有返回值

```javascript
// 推荐
const doubled = numbers.map(num => num * 2);
const evenNumbers = numbers.filter(num => num % 2 === 0);

// 避免
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  doubled.push(numbers[i] * 2);
}
```

### 6.2 对象操作
- 使用对象字面量创建对象
- 使用点号访问属性，特殊情况使用方括号
- 使用对象展开语法合并对象

```javascript
// 推荐
const user = { name: '张三', age: 25 };
const fullName = user.firstName + ' ' + user.lastName;
const newUser = { ...user, age: 26 };

// 避免
const user = new Object();
user.name = '张三';
user['age'] = 25; // 非特殊情况避免使用方括号
const newUser = Object.assign({}, user, { age: 26 }); // 优先使用展开语法
```

### 6.3 字符串操作
- 禁止不必要的字符串拼接
- 禁止不必要的转义字符

```javascript
// 推荐
const fullName = `${firstName} ${lastName}`;
const path = 'C:\\Users\\Name'; // 只转义必要的字符

// 避免
const fullName = firstName + ' ' + lastName; // 不必要的字符串拼接
const path = 'C:\\\\Users\\\\Name'; // 不必要的转义
```

### 6.4 表达式规则
- 禁止未使用的表达式

```javascript
// 推荐
const result = calculate(); // 使用表达式结果
if (isActive) doSomething(); // 条件表达式

// 避免
calculate(); // 未使用的表达式结果
isActive; // 未使用的变量表达式
```

## 7 控制流程

### 7.1 条件语句
- 使用严格相等运算符（=== 和 !==）
- 避免使用 Yoda 条件（如 if (5 === x)）
- 使用早期返回简化条件逻辑

```javascript
// 推荐
if (age === 18) { /* ... */ }
if (isActive && hasPermission) { /* ... */ }

// 避免
if (age == 18) { /* ... */ }
if (18 === age) { /* ... */ } // Yoda 条件
if (user) {
  if (user.isActive) {
    if (user.hasPermission) { /* ... */ }
  }
}
```

### 7.2 循环语句
- 优先使用 forEach, map 等数组方法
- 禁止使用不可达的循环
- 禁止循环条件未修改（可能导致死循环）

```javascript
// 推荐
users.forEach(user => { /* ... */ });

// 避免
for (let i = 0; i < 10; i--) { /* ... */ } // 错误：循环条件未正向修改
while (true) { /* ... */ } // 可能导致死循环
```

### 7.3 Switch 语句
- 必须包含 default 分支
- 禁止 case 穿透（无 break 时）
- 禁止在 case 中声明变量

```javascript
// 推荐
switch (status) {
  case 'active':
    // 处理激活状态
    break;
  case 'inactive':
    // 处理非激活状态
    break;
  default:
    // 处理默认情况
}

// 避免
switch (status) {
  case 'active':
    // 处理激活状态
  case 'inactive':
    // 处理非激活状态
    break;
}
```

## 8 异步编程

### 8.1 Promise
- 使用 Promise 链式调用替代回调地狱
- 要求在 Promise 拒绝时使用 Error 对象
- 禁止使用异步 Promise 执行器

```javascript
// 推荐
fetchData()
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => console.error('Error:', error));

// 避免
fetchData(function(data) {
  processData(data, function(result) {
    displayResult(result, function(error) {
      if (error) console.error('Error:', error);
    });
  });
});
```

### 8.2 Async/Await
- 优先使用 async/await 简化异步代码
- 要求在异步函数中使用 await
- 正确处理异步错误

```javascript
// 推荐
async function fetchUserData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// 避免
async function fetchUserData() {
  const user = fetchUser(); // 错误：缺少 await
  const posts = fetchPosts(user.id); // 错误：缺少 await
  return { user, posts };
}
```

## 9 错误处理

### 9.1 Try/Catch
- 使用 try/catch 处理可能抛出错误的代码
- 禁止使用无意义的 catch 块
- 禁止在 catch 中重新赋值错误对象

```javascript
// 推荐
try {
  const result = JSON.parse(data);
} catch (error) {
  console.error('Invalid JSON:', error);
}

// 避免
try {
  const result = JSON.parse(data);
} catch (error) {
  // 空的 catch 块
}

try {
  const result = JSON.parse(data);
} catch (error) {
  error = new Error('New error'); // 错误：重新赋值错误对象
}
```

### 9.2 自定义错误
- 使用 Error 对象或自定义错误类
- 提供有意义的错误消息

```javascript
// 推荐
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateUser(user) {
  if (!user.name) {
    throw new ValidationError('Name is required');
  }
}

// 避免
function validateUser(user) {
  if (!user.name) {
    throw 'Name is required'; // 错误：抛出非 Error 对象
  }
}
```

## 10 代码风格

### 10.1 缩进与空格
- 使用 2 个空格缩进
- 运算符前后必须有空格
- 逗号前面不能有空格，逗号后面必须有空格
- 对象字面量的大括号内必须有空格

```javascript
// 推荐
const user = {
  name: '张三',
  age: 25
};

const sum = 1 + 2;
const numbers = [1, 2, 3, 4];

// 避免
const user = {name:'张三',age:25};
const sum = 1+2;
const numbers = [1,2,3,4];
```

### 10.2 括号与引号
- 函数调用时圆括号内没有空格
- 条件语句的圆括号内没有空格
- 使用单引号或反引号

```javascript
// 推荐
function sayHello(name) {
  return `Hello, ${name}!`;
}

if (isActive) {
  // 代码
}

// 避免
function sayHello( name ) {
  return "Hello, " + name + "!";
}

if ( isActive ) {
  // 代码
}
```

### 10.3 分号
- 语句结束必须使用分号
- 禁止使用多余的分号

```javascript
// 推荐
const name = '张三';
function sayHello() { /* ... */ }

// 避免
const name = '张三'
function sayHello() { /* ... */ };
```

### 10.4 空行
- 函数之间添加空行
- 逻辑块之间添加空行
- 变量声明与代码之间添加空行

```javascript
// 推荐
const PI = 3.14159;
const MAX_SIZE = 100;

function calculateArea(radius) {
  return PI * radius * radius;
}

function calculateCircumference(radius) {
  return 2 * PI * radius;
}

// 避免
const PI = 3.14159;
const MAX_SIZE = 100;
function calculateArea(radius) {
  return PI * radius * radius;
}
function calculateCircumference(radius) {
  return 2 * PI * radius;
}
```

## 11 模块化

### 11.1 模块导入导出
- 使用 ES6 模块语法（import/export）
- 优先使用命名导出，避免默认导出
- 一个文件只导出一个主要模块时使用默认导出
- 禁止导入未使用的模块
- 禁止在模块顶层声明未使用的变量

```javascript
// 推荐 - 命名导出
// utils.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 推荐 - 默认导出
// UserService.js
class UserService {
  // 类实现
}
export default UserService;

// 推荐 - 导入方式
// app.js
import UserService from './UserService';
import { add, subtract } from './utils';
import * as utils from './utils'; // 通配符导入

// 避免 - 导入未使用的模块
import { add, subtract } from './utils'; // 只使用了 add

// 避免 - 混合导出方式
// UserService.js
export class UserService {
  // 类实现
}
export default UserService; // 重复导出
```

### 11.2 模块结构
- 模块结构清晰，功能单一
- 导出语句放在文件末尾
- 先导入外部依赖，再导入内部模块

```javascript
// 推荐
// UserService.js
// 1. 外部依赖导入
import axios from 'axios';
import { formatDate } from 'date-fns';

// 2. 内部模块导入
import { API_BASE_URL } from './config';
import { validateUser } from './validation';

// 3. 模块实现
class UserService {
  // 类实现
}

// 4. 导出语句
export default UserService;

// 避免 - 混乱的导入顺序
// UserService.js
import { API_BASE_URL } from './config';
import axios from 'axios';
import { validateUser } from './validation';
import { formatDate } from 'date-fns';

// 避免 - 导出语句分散
// utils.js
export const add = (a, b) => a + b;

// 中间是其他代码

const multiply = (a, b) => a * b;

export const divide = (a, b) => a / b;

export { multiply };
```

### 11.3 循环依赖
- 避免模块间的循环依赖
- 重构代码消除循环依赖

```javascript
// 避免 - 循环依赖
// moduleA.js
import { funcB } from './moduleB';

export function funcA() {
  return funcB();
}

// moduleB.js
import { funcA } from './moduleA';

export function funcB() {
  return funcA();
}

// 推荐 - 重构消除循环依赖
// moduleC.js
export function sharedFunc() {
  // 共享功能
}

// moduleA.js
import { sharedFunc } from './moduleC';

export function funcA() {
  return sharedFunc();
}

// moduleB.js
import { sharedFunc } from './moduleC';

export function funcB() {
  return sharedFunc();
}
```

## 12 最佳实践

### 12.1 性能优化
- 避免使用 eval() 函数
- 避免使用 with 语句
- 使用事件委托减少事件监听器数量
- 合理使用闭包，避免内存泄漏

### 11.2 可维护性
- 保持函数简洁（圈复杂度不超过 5）
- 函数最大语句数不超过 100 行
- 使用有意义的命名
- 添加必要的注释

### 11.3 安全性
- 防止 XSS 攻击（对用户输入进行转义）
- 避免使用不安全的随机数生成
- 不要在代码中硬编码敏感信息

### 11.4 代码质量
- 禁止使用 console（生产环境）
- 禁止使用 debugger 语句
- 避免使用全局变量
- 使用模块化开发

## 13 常见错误与避免方法

### 12.1 变量提升
- **问题**：变量在声明前被使用
- **避免方法**：使用 const/let 声明变量，将变量声明放在作用域顶部

### 12.2 闭包陷阱
- **问题**：循环中创建的闭包引用了同一个变量
- **避免方法**：使用 let 声明循环变量或使用函数工厂

### 12.3 类型比较
- **问题**：使用 == 进行类型不匹配的比较
- **避免方法**：使用 === 和 !== 进行严格相等比较

### 12.4 异步回调地狱
- **问题**：多层嵌套的回调函数
- **避免方法**：使用 Promise 或 async/await

### 12.5 内存泄漏
- **问题**：不再使用的内存没有被释放
- **避免方法**：及时清理事件监听器、定时器和不再使用的引用

## 14 代码示例

### 13.1 符合规范的代码

```javascript
// 用户服务模块
const API_URL = 'https://api.example.com/users';

class UserService {
  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  async getUser(id) {
    if (!id) {
      throw new Error('User ID is required');
    }

    try {
      const response = await this.httpClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async getActiveUsers() {
    try {
      const response = await this.httpClient.get(`${API_URL}?active=true`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  }

  validateUser(user) {
    const errors = [];

    if (!user.name) {
      errors.push('Name is required');
    }

    if (!user.email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(user.email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default UserService;
```

### 13.2 不符合规范的代码

```javascript
// 不符合规范的代码示例
var UserService = function(httpClient) {
  this.httpClient = httpClient;
}

UserService.prototype.getUser = function(id) {
  return this.httpClient.get('https://api.example.com/users/' + id).then(function(res) {
    return res.data;
  }).catch(function(err) {
    // 空的 catch 块
  })
}

UserService.prototype.validateUser = function(user) {
  if (user.name == '') { // 错误：使用 == 比较
    throw 'Name is required'; // 错误：抛出非 Error 对象
  }
  if (user.email == '') {
    throw 'Email is required';
  }
}

module.exports = UserService;
```
