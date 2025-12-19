# EJS开发规范

## 1 概述

本规范定义了EJS（Embedded JavaScript）模板引擎的开发规范，适用于所有使用EJS的项目。规范基于EJS的最佳实践和行业标准，包括基础规范、模板语法、JavaScript代码规范、代码风格等内容。

## 2 基础规范

### 2.1 文件扩展名
- **规则**：EJS文件使用`.ejs`扩展名
- **配置**：无需额外配置
  ```
  // 推荐
  index.ejs
  user-profile.ejs
  
  // 避免
  index.html
  user_profile.ejs
  ```

### 2.2 编码格式
- **规则**：使用UTF-8编码
- **配置**：无需额外配置

### 2.3 语法版本
- **规则**：使用EJS模板语法
- **配置**：`"extends": ["../../.eslintrc.ejs.js"]`

### 2.4 注释规范
- **规则**：使用HTML或JavaScript注释语法
- **配置**：无需额外配置
  ```ejs
  <!-- HTML注释 -->
  <%// JavaScript单行注释 %>
  <%/*
     JavaScript多行注释
  */%>
  ```

## 3 模板语法

### 3.1 输出表达式

#### 3.1.1 转义输出
- **规则**：使用`<%= %>`输出转义后的内容
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <h1><%= title %></h1>
  <p><%= description %></p>
  
  // 避免
  <h1><%=title%></h1> // 缺少空格
  <p><%= description %></p>
  ```

#### 3.1.2 非转义输出
- **规则**：使用`<%- %>`输出非转义的内容
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <%- htmlContent %>
  <%- include('partial') %>
  
  // 避免
  <%-htmlContent%> // 缺少空格
  <%- include('partial') %>
  ```

### 3.2 脚本标签

#### 3.2.1 执行脚本
- **规则**：使用`<% %>`执行JavaScript代码
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  
  <% for (let i = 0; i < items.length; i++) { %>
    <li><%= items[i] %></li>
  <% } %>
  
  // 避免
  <%if (user) {%> // 缺少空格
    <p>Welcome, <%= user.name %>!</p>
  <%}%>
  ```

#### 3.2.2 包含文件
- **规则**：使用`<%- include('file') %>`包含其他EJS文件
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <%- include('header') %>
  <div class="content">
    <!-- 内容 -->
  </div>
  <%- include('footer') %>
  
  // 避免
  <%-include('header')%> // 缺少空格
  ```

## 4 JavaScript代码规范

### 4.1 基础语法

#### 4.1.1 变量声明
- **规则**：使用`let`或`const`声明变量，不使用`var`
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% const title = 'Welcome'; %>
  <% let count = 0; %>
  
  // 避免
  <% var title = 'Welcome'; %> // 使用var声明变量
  ```

#### 4.1.2 分号
- **规则**：语句末尾必须加分号
- **配置**：`"semi": ["error", "always"]`
  ```ejs
  // 推荐
  <% const title = 'Welcome'; %>
  <% let count = 0; %>
  
  // 避免
  <% const title = 'Welcome' %> // 缺少分号
  <% let count = 0 %> // 缺少分号
  ```

#### 4.1.3 引号
- **规则**：字符串使用单引号
- **配置**：`"quotes": ["error", "single"]`
  ```ejs
  // 推荐
  <% const title = 'Welcome'; %>
  <p><%= 'Hello, World!' %></p>
  
  // 避免
  <% const title = "Welcome"; %> // 使用双引号
  <p><%= "Hello, World!" %></p> // 使用双引号
  ```

### 4.2 条件语句

#### 4.2.1 if语句
- **规则**：使用花括号包围if语句的代码块
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  
  <% if (user && user.isAdmin) { %>
    <p>Welcome, Admin!</p>
  <% } else { %>
    <p>Welcome, User!</p>
  <% } %>
  
  // 避免
  <% if (user) %>
    <p>Welcome, <%= user.name %>!</p> // 缺少花括号
  ```

#### 4.2.2 三元运算符
- **规则**：只在简单条件下使用三元运算符
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <p class="<%= user ? 'logged-in' : 'logged-out' %>">Status</p>
  
  // 避免
  <p class="<%= user ? (user.isAdmin ? 'admin' : 'user') : 'guest' %>">Status</p> // 嵌套层级过多
  ```

### 4.3 循环语句

#### 4.3.1 for循环
- **规则**：使用for循环遍历数组或对象
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% for (let i = 0; i < items.length; i++) { %>
    <li><%= items[i] %></li>
  <% } %>
  
  // 避免
  <% for (var i = 0; i < items.length; i++) { %> // 使用var声明变量
    <li><%= items[i] %></li>
  <% } %>
  ```

#### 4.3.2 forEach循环
- **规则**：使用forEach方法遍历数组
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% items.forEach(function(item, index) { %>
    <li><%= index + 1 %>. <%= item %></li>
  <% }); %>
  
  <% items.forEach((item, index) => { %>
    <li><%= index + 1 %>. <%= item %></li>
  <% }); %>
  
  // 避免
  <% items.forEach(function(item) { %>
    <li><%= item %></li>
  }); // 缺少分号
  ```

### 4.4 函数

#### 4.4.1 函数定义
- **规则**：使用函数表达式或箭头函数
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% const formatDate = function(date) { %>
    <% return new Date(date).toLocaleDateString(); %>
  <% } %>
  
  <% const formatDate = (date) => { %>
    <% return new Date(date).toLocaleDateString(); %>
  <% } %>
  
  // 避免
  <% function formatDate(date) { %> // 使用函数声明
    <% return new Date(date).toLocaleDateString(); %>
  <% } %>
  ```

#### 4.4.2 函数调用
- **规则**：在模板中调用函数时，使用输出表达式
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <p>Date: <%= formatDate(date) %></p>
  <p>Length: <%= items.length %></p>
  
  // 避免
  <p>Date: <%= formatDate( date ) %></p> // 多余的空格
  <p>Length: <%=items.length%></p> // 缺少空格
  ```

## 5 模板输出规范

### 5.1 HTML输出

#### 5.1.1 转义输出
- **规则**：默认使用转义输出，防止XSS攻击
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <h1><%= title %></h1>
  <p><%= description %></p>
  
  // 避免
  <h1><%- title %></h1> // 不必要的非转义输出
  <p><%- description %></p> // 不必要的非转义输出
  ```

#### 5.1.2 非转义输出
- **规则**：仅在需要输出HTML内容时使用非转义输出
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <%- htmlContent %>
  <%- include('partial') %>
  
  // 避免
  <%- user.name %> // 不必要的非转义输出
  ```

### 5.2 空格控制

#### 5.2.1 移除空白
- **规则**：使用`-%>`移除后面的空白，使用`<%-`移除前面的空白
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <% for (let i = 0; i < 3; i++) { -%>
    <div>Item <%= i %></div>
  <% } %>
  
  // 避免
  <% for (let i = 0; i < 3; i++) { %>
    <div>Item <%= i %></div>
  <% } %>
  ```

## 6 代码风格

### 6.1 缩进

#### 6.1.1 缩进大小
- **规则**：使用2个空格进行缩进
- **配置**：继承基础规则
  ```ejs
  // 推荐
  <% if (user) { %>
    <div class="user">
      <h2><%= user.name %></h2>
      <p><%= user.email %></p>
    </div>
  <% } %>
  
  // 避免
  <% if (user) { %>
      <div class="user">
          <h2><%= user.name %></h2>
          <p><%= user.email %></p>
      </div>
  <% } %>
  ```

#### 6.1.2 花括号
- **规则**：左花括号与条件语句在同一行，右花括号单独成行
- **配置**：继承基础规则
  ```ejs
  // 推荐
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  
  // 避免
  <% if (user)
  { %>
    <p>Welcome, <%= user.name %>!</p>
  <% }
  %>
  ```

### 6.2 空格

#### 6.2.1 表达式空格
- **规则**：EJS标签内部的表达式使用适当的空格
- **配置**：`"quotes": ["error", "single"]`, `"semi": ["error", "always"]`
  ```ejs
  // 推荐
  <h1><%= title %></h1>
  <p><%= description %></p>
  
  <% if (user) { %>
    <p>Welcome!</p>
  <% } %>
  
  // 避免
  <h1><%=title%></h1> // 缺少空格
  <p><%=description%></p> // 缺少空格
  
  <% if(user){%> // 缺少空格
    <p>Welcome!</p>
  <%}%> // 缺少空格
  ```

#### 6.2.2 运算符空格
- **规则**：运算符前后有空格
- **配置**：继承基础规则
  ```ejs
  // 推荐
  <p><%= a + b %></p>
  <p><%= a * b %></p>
  <p><%= a / b %></p>
  
  // 避免
  <p><%= a+b %></p> // 缺少空格
  <p><%= a*b %></p> // 缺少空格
  <p><%= a/b %></p> // 缺少空格
  ```

### 6.3 换行

#### 6.3.1 标签换行
- **规则**：EJS标签可以单独成行或与HTML内容在同一行
- **配置**：继承基础规则
  ```ejs
  // 推荐
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  
  <h1><%= title %></h1>
  <p><%= description %></p>
  
  // 避免
  <% if (user) { %><p>Welcome, <%= user.name %>!</p><% } %> // 所有内容在同一行
  ```

#### 6.3.2 代码块换行
- **规则**：代码块内部的语句单独成行
- **配置**：继承基础规则
  ```ejs
  // 推荐
  <% const items = [
    'Item 1',
    'Item 2',
    'Item 3'
  ]; %>
  
  // 避免
  <% const items = ['Item 1', 'Item 2', 'Item 3']; %> // 所有内容在同一行
  ```

## 7 性能优化

### 7.1 减少模板渲染时间

#### 7.1.1 避免在模板中执行复杂计算
- **规则**：将复杂计算移到模板外部
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <% // 在模板外部计算
  const total = items.reduce((sum, item) => sum + item.price, 0); %>
  <p>Total: <%= total %></p>
  
  // 避免
  <p>Total: <%= items.reduce((sum, item) => sum + item.price, 0) %></p> // 在模板中执行复杂计算
  ```

#### 7.1.2 缓存模板
- **规则**：使用模板缓存，避免重复编译
- **配置**：无需额外配置
  ```ejs
  // 推荐
  const ejs = require('ejs');
  const template = ejs.compile(fs.readFileSync('template.ejs', 'utf8'));
  
  // 避免
  const ejs = require('ejs');
  const html = ejs.render(fs.readFileSync('template.ejs', 'utf8'), data); // 每次都重新编译
  ```

### 7.2 减少HTTP请求

#### 7.2.1 合并静态资源
- **规则**：使用CDN或合并CSS/JavaScript文件
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  // 避免
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="css/custom.css">
  <script src="js/jquery.js"></script>
  <script src="js/bootstrap.js"></script>
  <script src="js/custom.js"></script>
  ```

## 8 调试与错误处理

### 8.1 调试

#### 8.1.1 禁止使用console
- **规则**：避免在生产环境中使用console
- **配置**：`"no-console": ["warn", { allow: ["error"] }]`
  ```ejs
  // 允许（仅开发环境）
  <% console.log('Debug:', user); %>
  <% console.error('Error:', error); %>
  
  // 避免（生产环境）
  <% console.log('Debug:', user); %>
  <% console.log('Debug:', items); %>
  ```

#### 8.1.2 禁止使用alert
- **规则**：禁止使用alert、confirm、prompt
- **配置**：`"no-alert": "error"`
  ```ejs
  // 避免
  <% alert('Welcome!'); %>
  <% const result = confirm('Are you sure?'); %>
  <% const name = prompt('Enter your name:'); %>
  ```

#### 8.1.3 禁止使用debugger
- **规则**：禁止使用debugger
- **配置**：`"no-debugger": "error"`
  ```ejs
  // 避免
  <% debugger; %>
  ```

### 8.2 错误处理

#### 8.2.1 异常处理
- **规则**：使用try-catch处理可能的异常
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% try { %>
    <p><%= formatDate(date) %></p>
  <% } catch (error) { %>
    <p>Error formatting date</p>
  <% } %>
  
  // 避免
  <p><%= formatDate(date) %></p> // 没有异常处理
  ```

#### 8.2.2 空值检查
- **规则**：在使用变量前进行空值检查
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% if (user && user.name) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  
  <p><%= items?.length || 0 %> items</p>
  
  // 避免
  <p>Welcome, <%= user.name %>!</p> // 没有空值检查
  <p><%= items.length %> items</p> // 没有空值检查
  ```

## 9 最佳实践

### 9.1 模块化

#### 9.1.1 拆分模板
- **规则**：将模板拆分为多个模块
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <!-- header.ejs -->
  <header>
    <h1><%= title %></h1>
  </header>
  
  <!-- footer.ejs -->
  <footer>
    <p>© <%= new Date().getFullYear() %></p>
  </footer>
  
  <!-- index.ejs -->
  <%- include('header') %>
  <main>
    <!-- 内容 -->
  </main>
  <%- include('footer') %>
  
  // 避免
  <!-- index.ejs（包含所有内容） -->
  <header>
    <h1><%= title %></h1>
  </header>
  <main>
    <!-- 内容 -->
  </main>
  <footer>
    <p>© <%= new Date().getFullYear() %></p>
  </footer>
  ```

#### 9.1.2 传入参数
- **规则**：通过include传递参数
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <%- include('partial', { title: 'Partial Title', items: items }) %>
  
  // 避免
  <%- include('partial') %> // 没有传递必要的参数
  ```

### 9.2 可维护性

#### 9.2.1 使用变量
- **规则**：将重复使用的值定义为变量
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% const baseUrl = '/api'; %>
  <a href="<%= baseUrl %>/users">Users</a>
  <a href="<%= baseUrl %>/items">Items</a>
  
  // 避免
  <a href="/api/users">Users</a>
  <a href="/api/items">Items</a> // 重复的URL前缀
  ```

#### 9.2.2 使用函数
- **规则**：将重复使用的逻辑封装为函数
- **配置**：无需额外配置（继承基础规则）
  ```ejs
  // 推荐
  <% const formatDate = (date) => { %>
    <% return new Date(date).toLocaleDateString(); %>
  <% } %>
  
  <p><%= formatDate(date1) %></p>
  <p><%= formatDate(date2) %></p>
  <p><%= formatDate(date3) %></p>
  
  // 避免
  <p><%= new Date(date1).toLocaleDateString(); %></p>
  <p><%= new Date(date2).toLocaleDateString(); %></p> // 重复的代码
  <p><%= new Date(date3).toLocaleDateString(); %></p> // 重复的代码
  ```

### 9.3 安全性

#### 9.3.1 防止XSS攻击
- **规则**：默认使用转义输出
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <h1><%= title %></h1>
  <p><%= description %></p>
  
  // 避免
  <h1><%- title %></h1> // 不必要的非转义输出
  <p><%- description %></p> // 不必要的非转义输出
  ```

#### 9.3.2 验证输入
- **规则**：在服务器端验证用户输入
- **配置**：无需额外配置
  ```ejs
  // 推荐
  <% // 在服务器端验证输入
  const user = validateUser(req.body); %>
  <h1>Welcome, <%= user.name %>!</h1>
  
  // 避免
  <h1>Welcome, <%= req.body.name %>!</h1> // 没有验证输入
  ```

## 10 代码示例

### 10.1 符合规范的代码

```ejs
<!-- index.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <%- include('header', { title: title }) %>
  
  <main class="container">
    <h2>Welcome to <%= title %></h2>
    
    <% if (user) { %>
      <div class="user-info">
        <h3>User Information</h3>
        <p>Name: <%= user.name %></p>
        <p>Email: <%= user.email %></p>
        
        <% if (user.isAdmin) { %>
          <p>Role: Admin</p>
        <% } else { %>
          <p>Role: User</p>
        <% } %>
      </div>
    <% } %>
    
    <div class="items">
      <h3>Items (<%= items.length %>)</h3>
      <% if (items.length > 0) { %>
        <ul>
          <% items.forEach((item, index) => { %>
            <li>
              <h4><%= item.name %></h4>
              <p><%= item.description %></p>
              <p class="price">$<%= item.price.toFixed(2) %></p>
            </li>
          <% }); %>
        </ul>
        
        <% const total = items.reduce((sum, item) => sum + item.price, 0); %>
        <p class="total">Total: $<%= total.toFixed(2) %></p>
      <% } else { %>
        <p>No items found.</p>
      <% } %>
    </div>
  </main>
  
  <%- include('footer') %>
  
  <script src="/js/main.js"></script>
</body>
</html>

<!-- header.ejs -->
<header class="header">
  <div class="logo">
    <h1><%= title %></h1>
  </div>
  <nav class="nav">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>

<!-- footer.ejs -->
<footer class="footer">
  <p>&copy; <%= new Date().getFullYear() %> <%= title %></p>
</footer>
```

### 10.2 不符合规范的代码

```ejs
<!-- index.ejs -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%=title%></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header>
    <h1><%=title%></h1>
  </header>
  
  <main>
    <h2>Welcome to <%=title%></h2>
    
    <%if(user){%>
      <div class="user-info">
        <h3>User Information</h3>
        <p>Name: <%=user.name%></p>
        <p>Email: <%=user.email%></p>
        
        <%if(user.isAdmin){%>
          <p>Role: Admin</p>
        <%}else{%>
          <p>Role: User</p>
        <%}%>
      </div>
    <%}%>
    
    <div class="items">
      <h3>Items (<%=items.length%>)</h3>
      <%if(items.length>0){%>
        <ul>
          <%for(var i=0;i<items.length;i++){%>
            <li>
              <h4><%=items[i].name%></h4>
              <p><%=items[i].description%></p>
              <p class="price">$<%=items[i].price.toFixed(2)%></p>
            </li>
          <%}%>
        </ul>
        
        <p class="total">Total: $<%=items.reduce(function(sum,item){return sum+item.price;},0).toFixed(2)%></p>
      <%}else{%>
        <p>No items found.</p>
      <%}%>
    </div>
  </main>
  
  <footer>
    <p>&copy; <%=new Date().getFullYear()%> <%=title%></p>
  </footer>
  
  <script src="/js/main.js"></script>
</body>
</html>
```

## 11 常见错误与避免方法

### 11.1 缺少分号
- **错误**：语句末尾缺少分号
- **避免**：确保所有语句末尾都有分号
  ```ejs
  // 错误
  <% const title = 'Welcome' %>
  <% let count = 0 %>
  
  // 正确
  <% const title = 'Welcome'; %>
  <% let count = 0; %>
  ```

### 11.2 使用双引号
- **错误**：字符串使用双引号
- **避免**：字符串使用单引号
  ```ejs
  // 错误
  <% const title = "Welcome"; %>
  <p><%= "Hello, World!" %></p>
  
  // 正确
  <% const title = 'Welcome'; %>
  <p><%= 'Hello, World!' %></p>
  ```

### 11.3 缺少空格
- **错误**：EJS标签内部缺少空格
- **避免**：在EJS标签内部使用适当的空格
  ```ejs
  // 错误
  <h1><%=title%></h1>
  <p><%=description%></p>
  <%if(user){%>
    <p>Welcome!</p>
  <%}%>
  
  // 正确
  <h1><%= title %></h1>
  <p><%= description %></p>
  <% if (user) { %>
    <p>Welcome!</p>
  <% } %>
  ```

### 11.4 不必要的非转义输出
- **错误**：使用不必要的非转义输出
- **避免**：默认使用转义输出
  ```ejs
  // 错误
  <h1><%- title %></h1>
  <p><%- description %></p>
  
  // 正确
  <h1><%= title %></h1>
  <p><%= description %></p>
  ```

### 11.5 缺少空值检查
- **错误**：在使用变量前没有进行空值检查
- **避免**：在使用变量前进行空值检查
  ```ejs
  // 错误
  <p>Welcome, <%= user.name %>!</p>
  <p><%= items.length %> items</p>
  
  // 正确
  <% if (user && user.name) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  <p><%= items?.length || 0 %> items</p>
  ```

### 11.6 使用var声明变量
- **错误**：使用var声明变量
- **避免**：使用let或const声明变量
  ```ejs
  // 错误
  <% var title = 'Welcome'; %>
  <% var count = 0; %>
  
  // 正确
  <% const title = 'Welcome'; %>
  <% let count = 0; %>
  ```

### 11.7 在模板中执行复杂计算
- **错误**：在模板中执行复杂计算
- **避免**：将复杂计算移到模板外部
  ```ejs
  // 错误
  <p>Total: <%= items.reduce(function(sum, item) { return sum + item.price; }, 0).toFixed(2); %></p>
  
  // 正确
  <% const total = items.reduce((sum, item) => sum + item.price, 0); %>
  <p>Total: <%= total.toFixed(2) %></p>
  ```

### 11.8 使用alert、confirm、prompt
- **错误**：使用alert、confirm、prompt
- **避免**：禁止使用这些函数
  ```ejs
  // 错误
  <% alert('Welcome!'); %>
  <% const result = confirm('Are you sure?'); %>
  <% const name = prompt('Enter your name:'); %>
  
  // 正确
  // 不使用这些函数
  ```

### 11.9 使用debugger
- **错误**：使用debugger
- **避免**：禁止使用debugger
  ```ejs
  // 错误
  <% debugger; %>
  
  // 正确
  // 不使用debugger
  ```

### 11.10 所有内容在同一行
- **错误**：所有内容在同一行
- **避免**：代码块内部的语句单独成行
  ```ejs
  // 错误
  <% if (user) { %><p>Welcome, <%= user.name %>!</p><% } %>
  
  // 正确
  <% if (user) { %>
    <p>Welcome, <%= user.name %>!</p>
  <% } %>
  ```

## 11 总结

本规范定义了EJS模板引擎的开发规范，包括基础规范、模板语法、JavaScript代码规范、代码风格等内容。遵循这些规范可以提高代码的可读性、可维护性和质量，减少潜在的错误和问题。