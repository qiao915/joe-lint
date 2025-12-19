# HTML 开发规范

## 1 基础规范

### 1.1 文档结构
- **DOCTYPE 声明**：HTML 文档必须以 `<!DOCTYPE html>` 开头
  ```html
  <!DOCTYPE html>
  <html lang="zh-CN">
  <!-- 文档内容 -->
  </html>
  ```
- **语言属性**：HTML 根元素必须包含 `lang` 属性，指定文档的主要语言
  ```html
  <!-- 推荐 -->
  <html lang="zh-CN">
  
  <!-- 避免 -->
  <html>
  ```
- **字符编码**：必须使用 UTF-8 字符编码
  ```html
  <meta charset="UTF-8">
  ```
- **视口设置**：移动端页面必须设置适当的视口
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- **标题标签**：每个 HTML 文档必须包含 `<title>` 标签
  ```html
  <head>
    <title>页面标题</title>
  </head>
  ```

### 1.2 标签使用
- **标签闭合**：所有 HTML 标签必须正确闭合
  ```html
  <!-- 推荐 -->
  <p>这是一个段落</p>
  <br>
  <img src="image.jpg" alt="图片">
  
  <!-- 避免 -->
  <p>这是一个段落
  <br />
  ```
- **嵌套规则**：标签必须正确嵌套，不得交叉
  ```html
  <!-- 推荐 -->
  <div>
    <p>内容</p>
  </div>
  
  <!-- 避免 -->
  <div>
    <p>内容</div>
  </p>
  ```
- **小写标签**：HTML 标签和属性名必须使用小写
  ```html
  <!-- 推荐 -->
  <div class="container">
  
  <!-- 避免 -->
  <DIV CLASS="container">
  ```

### 1.3 属性规范
- **引号使用**：属性值必须使用双引号包裹
  ```html
  <!-- 推荐 -->
  <div class="container">
  
  <!-- 避免 -->
  <div class='container'>
  <div class=container>
  ```
- **属性顺序**：HTML 属性应按照一定顺序排列，提高可读性
  ```html
  <!-- 推荐 -->
  <a href="#" class="link" id="main-link" target="_blank">链接</a>
  
  <!-- 顺序建议：
  1. 核心属性：id, class
  2. 内容属性：href, src, alt, title
  3. 表单属性：type, name, value
  4. 事件属性：onclick, onchange
  -->
  ```
- **无重复属性**：同一标签内不得出现重复属性
  ```html
  <!-- 避免 -->
  <div class="container" class="main">
  ```
- **无无效字符**：属性值不得包含不安全的字符
  ```html
  <!-- 推荐 -->
  <div data-value="safe-value">
  
  <!-- 避免 -->
  <div data-value="unsafe<value">
  ```

## 2 语义化标签

### 2.1 优先使用语义化标签
- 使用具有语义的 HTML5 标签来描述内容结构
  ```html
  <!-- 推荐 -->
  <header>
    <nav>
      <ul>
        <li><a href="#">导航项</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h1>文章标题</h1>
      <section>
        <h2>章节标题</h2>
        <p>章节内容</p>
      </section>
    </article>
  </main>
  <footer>
    <p>版权信息</p>
  </footer>
  
  <!-- 避免 -->
  <div id="header">
    <div id="nav">
      <!-- 导航内容 -->
    </div>
  </div>
  <div id="main">
    <div id="article">
      <!-- 文章内容 -->
    </div>
  </div>
  <div id="footer">
    <!-- 页脚内容 -->
  </div>
  ```

### 2.2 常用语义化标签
- `<header>`：页面或区块的头部
- `<nav>`：导航链接区域
- `<main>`：页面的主要内容
- `<article>`：独立的内容区块
- `<section>`：文档中的章节
- `<aside>`：侧边栏或附加内容
- `<footer>`：页面或区块的底部
- `<figure>`：独立的媒体内容，如图片、图表等
- `<figcaption>`：`<figure>` 的标题或说明
- `<time>`：日期或时间

## 3 样式与脚本

### 3.1 CSS 引用
- **外部 CSS**：样式应放在外部 CSS 文件中，使用 `<link>` 标签引入
  ```html
  <head>
    <link rel="stylesheet" href="styles.css">
  </head>
  ```
- **内联样式**：尽量避免使用内联样式
  ```html
  <!-- 避免 -->
  <div style="color: red; font-size: 16px;">内容</div>
  ```
- **CSS 位置**：`<link>` 标签应放在 `<head>` 标签内

### 3.2 JavaScript 引用
- **外部 JavaScript**：脚本应放在外部 JS 文件中，使用 `<script>` 标签引入
  ```html
  <!-- 推荐 -->
  <script src="script.js"></script>
  ```
- **脚本位置**：脚本应放在 `<body>` 标签底部，或者使用 `async`/`defer` 属性
  ```html
  <!-- 推荐 -->
  <body>
    <!-- 页面内容 -->
    <script src="script.js"></script>
  </body>
  
  <!-- 或使用 async/defer -->
  <head>
    <script src="script.js" defer></script>
  </head>
  ```
- **内联脚本**：尽量避免使用内联脚本
  ```html
  <!-- 避免 -->
  <script>
    // JavaScript 代码
  </script>
  ```

## 4 表单规范

### 4.1 表单结构
- **表单元素分组**：使用 `<fieldset>` 和 `<legend>` 对相关表单元素进行分组
  ```html
  <form>
    <fieldset>
      <legend>个人信息</legend>
      <!-- 表单元素 -->
    </fieldset>
  </form>
  ```
- **标签关联**：每个表单控件必须有对应的 `<label>` 标签，并通过 `for` 属性与控件关联
  ```html
  <!-- 推荐 -->
  <label for="username">用户名</label>
  <input type="text" id="username" name="username">
  
  <!-- 或 -->
  <label>
    <input type="checkbox" name="agree"> 同意条款
  </label>
  ```

### 4.2 表单控件
- **类型指定**：必须为 `<input>` 元素指定 `type` 属性
  ```html
  <!-- 推荐 -->
  <input type="text" name="username">
  <input type="email" name="email">
  <input type="password" name="password">
  
  <!-- 避免 -->
  <input name="username">
  ```
- **占位符**：适当使用 `placeholder` 属性提供输入提示，但不能替代 `<label>`
  ```html
  <input type="text" name="username" placeholder="请输入用户名">
  ```
- **必填标记**：必填字段应使用 `required` 属性
  ```html
  <input type="text" name="username" required>
  ```

## 5 图片规范

### 5.1 图片使用
- **alt 属性**：所有 `<img>` 元素必须包含 `alt` 属性，提供图片的替代文本
  ```html
  <!-- 推荐 -->
  <img src="image.jpg" alt="描述图片内容">
  
  <!-- 避免 -->
  <img src="image.jpg">
  ```
- **尺寸属性**：为图片指定宽度和高度，避免页面重排
  ```html
  <img src="image.jpg" alt="描述" width="300" height="200">
  ```
- **响应式图片**：使用 `srcset` 和 `sizes` 属性提供响应式图片
  ```html
  <img src="small.jpg" srcset="small.jpg 300w, medium.jpg 600w, large.jpg 1200w" sizes="(max-width: 600px) 300px, 600px" alt="描述">
  ```

### 5.2 背景图片
- **内容图片**：有意义的图片应使用 `<img>` 标签，而非背景图片
- **装饰图片**：纯装饰性图片应使用 CSS 背景图片

## 6 链接规范

### 6.1 链接属性
- **href 属性**：所有 `<a>` 标签必须包含 `href` 属性
  ```html
  <!-- 推荐 -->
  <a href="https://www.example.com">链接文本</a>
  
  <!-- 避免 -->
  <a>链接文本</a>
  ```
- **目标属性**：使用 `target="_blank"` 打开新窗口时，必须添加 `rel="noopener noreferrer"` 属性，提高安全性
  ```html
  <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">新窗口打开</a>
  ```

### 6.2 锚点链接
- **ID 唯一性**：页面内的锚点 ID 必须唯一
  ```html
  <!-- 推荐 -->
  <h2 id="section1">章节标题</h2>
  <a href="#section1">跳转到章节</a>
  
  <!-- 避免 -->
  <h2 id="section">章节标题 1</h2>
  <h2 id="section">章节标题 2</h2>
  ```

## 7 可访问性规范

### 7.1 基本可访问性
- **键盘导航**：所有交互元素必须可以通过键盘访问
- **ARIA 属性**：适当使用 ARIA 属性增强可访问性
  ```html
  <button aria-label="关闭">×</button>
  ```
- **颜色对比度**：确保文本和背景色的对比度符合 WCAG 标准

### 7.2 焦点管理
- **焦点样式**：不得移除或隐藏默认的焦点样式
  ```css
  /* 避免 */
  :focus {
    outline: none;
  }
  
  /* 推荐 */
  :focus {
    outline: 2px solid #0066cc;
  }
  ```

## 8 性能优化

### 8.1 减少 HTTP 请求
- **合并文件**：合并 CSS 和 JavaScript 文件
- **图片优化**：使用适当大小和格式的图片，压缩图片
- **字体优化**：使用 Web 字体时，仅加载必要的字体变体

### 8.2 懒加载
- **图片懒加载**：使用 `loading="lazy"` 属性实现图片懒加载
  ```html
  <img src="image.jpg" alt="描述" loading="lazy">
  ```
- **组件懒加载**：对于大型页面，考虑实现组件级别的懒加载

## 9 代码风格

### 9.1 缩进与空格
- **缩进**：使用 2 个空格进行缩进
- **换行**：标签内容超过一行时应换行
  ```html
  <!-- 推荐 -->
  <div class="container">
    <p>这是一段较长的文本内容，
    超过一行时应该换行。</p>
  </div>
  ```
- **属性换行**：标签属性过多时应换行，每行一个属性
  ```html
  <!-- 推荐 -->
  <div class="container" 
       id="main" 
       data-value="example">
    内容
  </div>
  ```

### 9.2 注释规范
- **注释内容**：注释应简洁明了，说明代码的用途和功能
- **注释格式**：使用 `<!-- 注释内容 -->` 格式
  ```html
  <!-- 页面头部 -->
  <header>
    <!-- 导航菜单 -->
    <nav>
      <!-- 导航项 -->
    </nav>
  </header>
  ```

### 9.3 命名规范
- **ID 和类名**：使用语义化的 ID 和类名，采用小写字母和连字符分隔
  ```html
  <!-- 推荐 -->
  <div class="user-profile">
    <h3 class="user-name">用户名</h3>
  </div>
  
  <!-- 避免 -->
  <div class="userProfile">
    <h3 class="UserName">用户名</h3>
  </div>
  ```

## 10 最佳实践

### 10.1 避免的做法
- **避免使用表格布局**：不要使用 `<table>` 进行页面布局
- **避免使用框架特定的标签**：除非必要，否则不要使用特定框架的自定义标签
- **避免过度使用 `<div>`**：优先使用语义化标签
- **避免空标签**：不要使用没有内容或属性的空标签

### 10.2 推荐的做法
- **使用 HTML5 特性**：充分利用 HTML5 的新特性和 API
- **保持代码简洁**：删除不必要的标签和属性
- **测试兼容性**：确保代码在不同浏览器和设备上正常工作
- **使用验证工具**：使用 HTML 验证工具检查代码的有效性

```html
<!-- 完整的 HTML 文档示例 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">首页</a></li>
        <li><a href="#">关于我们</a></li>
        <li><a href="#">联系我们</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <h1>文章标题</h1>
      <section>
        <h2>章节标题</h2>
        <p>章节内容</p>
        <img src="image.jpg" alt="图片描述" loading="lazy">
      </section>
    </article>
    
    <aside>
      <h3>侧边栏</h3>
      <p>侧边栏内容</p>
    </aside>
  </main>
  
  <footer>
    <p>© 2023 版权信息</p>
  </footer>
</body>
</html>
```