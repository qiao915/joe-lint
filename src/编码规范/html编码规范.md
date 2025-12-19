# HTML 编码规范

## 1 HTML 编写原则

### 1.1 语义化优先
- 使用合适的HTML5语义化标签，提高代码可读性和SEO
- 避免滥用div和span作为容器，优先考虑语义化标签

```html
<!-- 推荐 -->
<header>
  <nav>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">关于</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容...</p>
  </article>
</main>
<footer>
  <p>版权信息</p>
</footer>

<!-- 避免 -->
<div id="header">
  <div class="nav">
    <div class="nav-item">首页</div>
    <div class="nav-item">关于</div>
  </div>
</div>
```

### 1.2 简洁性与高效性
- 尽可能减少页面上的标签数量
- 减少标签嵌套层级，避免过深的DOM树（建议不超过4-5层）
- 多利用CSS伪元素（:before, :after）来实现纯装饰性效果
- 浏览器在解析标签时只有碰到结束标记才会渲染，保持结构简洁有助于渲染性能

## 2 文档结构规范

### 2.1 HTML文档结构
- 使用正确的DOCTYPE声明
- 提供适当的语言属性
- 设置合适的字符编码
- 添加viewport元标签以支持响应式设计

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>
  <!-- 其他头部信息 -->
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```

### 2.2 头部规范
- 确保title标签内容简洁明了，包含页面核心信息
- 合理使用meta标签（description, keywords等）
- 样式表应放在head中，脚本应放在body底部（或使用async/defer）

## 3 元素与属性规范

### 3.1 属性使用
- 始终使用小写字母书写标签和属性
- 属性值必须用引号包围（推荐使用双引号）
- 布尔属性可以不指定值
- 避免使用内联样式属性，使用class类名来设置样式

```html
<!-- 推荐 -->
<input type="text" disabled>
<img src="logo.png" alt="网站Logo">

<!-- 避免 -->
<INPUT TYPE="TEXT" DISABLED="disabled">
<img src=logo.png alt=网站Logo>
<div style="color: red; font-size: 14px;">文本</div>
```

### 3.2 图像规范
- 所有图像必须包含alt属性，提供替代文本
- 如alt文本为空，可保留空的alt属性（alt=""），但不要完全省略
- 使用合适的图像格式和尺寸，考虑使用现代格式如WebP
- 为大型图像提供width和height属性，减少布局偏移

```html
<img src="product.jpg" alt="产品图片" width="600" height="400">
<img src="decorative-divider.png" alt="">
```

### 3.3 表单规范
- 使用label标签与表单控件关联
- 为每个表单元素设置适当的name和id属性
- 使用适当的input类型（email, tel, number等）提高用户体验
- 添加placeholder属性提供输入提示，但不要仅依靠placeholder作为标签
- 实现表单验证（HTML5验证或自定义验证）

```html
<form>
  <div>
    <label for="email">邮箱:</label>
    <input type="email" id="email" name="email" required placeholder="请输入邮箱">
  </div>
  <button type="submit">提交</button>
</form>
```

## 4 无障碍性规范

### 4.1 基本无障碍原则
- 确保所有非文本内容都有文本替代（如图像的alt属性）
- 提供清晰的页面结构和导航
- 确保所有功能都可以通过键盘操作

### 4.2 无障碍属性
- 使用ARIA角色和属性增强无障碍性
- 为页面添加适当的ARIA标签
- 确保正确的标题层次结构（h1-h6）

```html
<!-- 使用ARIA角色 -->
<div role="navigation" aria-label="主导航">
  <!-- 导航内容 -->
</div>

<!-- 正确的标题层次 -->
<h1>网站标题</h1>
<section>
  <h2>章节标题</h2>
  <h3>小节标题</h3>
</section>
```

## 5 性能优化

### 5.1 资源加载优化
- 内联关键CSS以加快首屏渲染
- 使用适当的资源预加载
- 延迟加载非关键资源
- 优化图像大小和格式

```html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.js" as="script">

<!-- 延迟加载图像 -->
<img src="large-image.jpg" loading="lazy" alt="描述">
```

### 5.2 减少阻塞资源
- 将非关键JavaScript放在body底部
- 使用async或defer属性加载脚本
- 避免在页面中嵌入大量的内联脚本

```html
<!-- 异步加载脚本 -->
<script src="non-critical.js" async></script>

<!-- 延迟加载脚本 -->
<script src="deferred.js" defer></script>
```

## 6 现代HTML特性

### 6.1 HTML5语义化标签
- 正确使用以下标签：
  - `<header>`, `<nav>`, `<main>`, `<footer>`
  - `<article>`, `<section>`, `<aside>`
  - `<hgroup>`, `<figure>`, `<figcaption>`
  - `<time>`, `<mark>`, `<progress>`

### 6.2 现代API和功能
- 使用HTML5表单验证
- 利用Web Storage API存储数据
- 使用地理位置API、通知API等增强用户体验

```html
<!-- HTML5表单验证 -->
<input type="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$">

<!-- HTML5语义化标签 -->
<time datetime="2023-12-25">2023年12月25日</time>
<progress value="70" max="100"></progress>
```

## 7 SEO优化

### 7.1 基本SEO标签
- 使用适当的title和meta description
- 为页面内容使用合适的标题层次
- 使用canonical标签避免重复内容问题
- 添加适当的结构化数据（Schema.org）

```html
<!-- 基本SEO标签 -->
<meta name="description" content="页面详细描述，用于搜索引擎结果展示">
<link rel="canonical" href="https://example.com/current-page">

<!-- 结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "页面名称",
  "description": "页面描述"
}
</script>
```

## 8 注释规范

### 8.1 注释风格
- 使用简洁明了的注释说明复杂结构或特殊处理
- 注释应清晰表达代码的用途和逻辑
- 对暂时需要保留但不使用的代码使用注释标记

```html
<!-- 导航栏 -->
<nav class="main-nav">
  <!-- 导航链接 -->
  <ul>
    <li><a href="/">首页</a></li>
    <!-- TODO: 添加更多导航项 -->
  </ul>
</nav>
```

## 9 代码格式化

### 9.1 格式统一
- 使用一致的缩进（推荐使用2个空格）
- 标签内容过长时进行适当换行
- 保持一致的属性顺序（通常是id, class, 其他属性）
- 标签自闭合时统一使用斜杠或省略（HTML5中可以省略）

```html
<!-- 推荐 -->
<div class="container">
  <div class="header">
    <h1>标题</h1>
  </div>
  <img 
    src="long-path-to-image.jpg" 
    alt="详细的图像描述" 
    class="featured-image"
  >
</div>
```

## 10 最佳实践

### 10.1 避免的实践
- 避免使用废弃的HTML标签和属性
- 避免使用表格进行页面布局
- 避免在HTML中使用JavaScript事件处理器属性（如onclick）
- 避免在页面中嵌入大量的内联CSS和JavaScript