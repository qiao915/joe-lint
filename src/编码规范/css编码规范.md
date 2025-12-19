# CSS 编码规范

## 1 命名规范

### 1.1 命名风格
- 采用 BEM (Block Element Modifier) 命名约定，提高代码可维护性
  ```css
  .block {}
  .block__element {}
  .block--modifier {}
  
  /* 示例 */
  .header {}
  .header__logo {}
  .header--dark {}
  ```
- 长名称或词组使用中横线来连接（kebab-case）
- 不使用下划线来命名，避免与 BEM 规范冲突
- 一律采用小写英文字母，不以数字和连字符开头
- 避免使用拼音和拼音缩写，采用完整有意义的英文单词
- 避免使用通用无意义的名称，如 `.box`, `.container`, `.content`

### 1.2 语义化命名
- 基于功能命名，而非样式命名
  ```css
  /* 推荐 */
  .navigation {}
  .login-form {}
  
  /* 避免 */
  .left-menu {}
  .red-button {}
  ```

## 2 CSS 属性书写顺序

### 2.1 推荐顺序
- **布局属性**：position, top, right, bottom, left, z-index, display, float, flex, grid
- **盒模型属性**：width, height, padding, margin, border
- **文本属性**：font, line-height, letter-spacing, text-align, color
- **背景与边框**：background, border
- **其他属性**：animation, transition, transform

```css
.element {
  /* 布局 */
  position: relative;
  display: flex;
  z-index: 10;
  
  /* 盒模型 */
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  
  /* 文本 */
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  
  /* 背景 */
  background-color: #fff;
  
  /* 其他 */
  transition: all 0.3s ease;
}
```

### 2.2 顺序原则
- 会触发重排（回流 reflow）的属性写在触发重绘（repaint）的属性前面
- 相关联的属性放在一起，提高可读性和维护性

## 3 选择器规范

### 3.1 选择器使用原则
- 优先使用类选择器，避免使用ID选择器进行样式定义
- 避免使用通配符选择器（*），会影响性能
- 避免使用标签选择器，除非必要（如重置样式）
- 限制选择器的层级，不超过3级
  ```css
  /* 推荐 */
  .nav-item--active {}
  
  /* 避免 */
  .header .nav ul li.active {}
  ```
- 禁止在ID选择器前面进行嵌套或添加附加的选择器

### 3.2 优先级管理
- 尽量减少使用 `!important` 来强制覆盖样式
- 当必须使用 `!important` 时，确保添加注释说明原因
- 为元素添加 z-index 前进行分层规划，避免数值冲突

## 4 CSS 变量（自定义属性）

### 4.1 使用规范
- 定义主题相关的颜色、间距、字体等变量
- 变量命名使用连字符，前缀统一（如 `--color-primary`）

```css
:root {
  /* 颜色变量 */
  --color-primary: #1890ff;
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #f5222d;
  
  /* 间距变量 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

.button {
  background-color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-md);
}
```

## 5 模块化 CSS

### 5.1 CSS Modules 使用
- 使用CSS Modules隔离样式作用域
- 类名使用驼峰命名以便在JS中访问

**使用CSS Modules的好处：**
1. **样式隔离**：每个组件的CSS类名会被自动哈希处理，避免全局命名冲突
2. **局部作用域**：默认情况下所有样式都是局部的，只有通过`:global()`显式声明的才会变成全局样式
3. **JS和CSS的联系**：可以在JavaScript中直接引用CSS类名，支持IDE自动补全和类型检查
4. **构建时优化**：未使用的CSS会被自动移除，减小打包体积
5. **渐进式采用**：可以在现有项目中逐步引入，不需要一次性重构所有样式

**CSS Modules示例代码：**

```css
/* styles.module.css */
.container {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.button {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #40a9ff;
}

.button--disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}
```

```jsx
// 组件中使用
import styles from './styles.module.css';

const MyComponent = ({ title, disabled }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <button 
        className={`${styles.button} ${disabled ? styles['button--disabled'] : ''}`}
        disabled={disabled}
      >
        点击按钮
      </button>
    </div>
  );
};
```

### 5.2 CSS-in-JS 规范
- 使用流行的CSS-in-JS解决方案如Styled Components或Emotion
- 组件样式与逻辑保持在同一文件中

**使用CSS-in-JS的好处：**
1. **组件化思维**：样式与组件逻辑紧密结合，符合组件化开发理念
2. **动态样式**：可以基于props和状态动态生成样式，无需复杂的类名切换
3. **主题支持**：内置主题系统，便于实现主题切换功能
4. **无命名冲突**：自动生成唯一类名，彻底解决样式冲突问题
5. **JavaScript强大功能**：可以在样式中使用JavaScript的全部功能，如循环、条件判断等
6. **代码分割**：样式随组件一起分割，只有当组件被加载时样式才会被注入
7. **类型安全**：在TypeScript项目中提供更好的类型检查和开发体验

**Styled Components示例代码：**

```jsx
// 使用Styled Components
import styled, { css } from 'styled-components';

// 基础容器样式
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  
  /* 支持响应式 */
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

// 标题样式
const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  
  /* 动态属性 */
  ${props => props.large && css`
    font-size: 24px;
    margin-bottom: 20px;
  `}
`;

// 按钮样式
const Button = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.disabled ? '#d9d9d9' : '#1890ff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#d9d9d9' : '#40a9ff'};
  }
`;

// 组件使用
const MyComponent = ({ title, disabled, largeTitle }) => {
  return (
    <Container>
      <Title large={largeTitle}>{title}</Title>
      <Button disabled={disabled}>点击按钮</Button>
    </Container>
  );
};

/* Emotion示例（另一种CSS-in-JS方案） */
import { css } from '@emotion/react';

// 样式定义
const containerStyle = css`
  display: flex;
  padding: 16px;
`;

const MyEmotionComponent = () => {
  return <div css={containerStyle}>Emotion组件</div>;
};
```

## 6 响应式设计

### 6.1 媒体查询规范
- 使用移动优先的设计原则
- 媒体查询断点统一设置
- 使用相对单位（rem, em, vh, vw）而非固定像素

```css
/* 移动优先 */
.container {
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 1.5rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
  }
}
```

### 6.2 响应式图像
- 使用 `max-width: 100%` 确保图像自适应容器
- 考虑使用 `srcset` 和 `sizes` 提供不同分辨率的图像

## 7 性能优化

### 7.1 CSS 性能最佳实践
- 避免使用昂贵的选择器（如通配符、属性选择器）
- 避免使用大量的CSS动画，优先使用transform和opacity
- 合并和压缩CSS文件
- 使用CSS预处理器（Sass/Less）的嵌套功能，但避免过深嵌套

### 7.2 避免重排和重绘
- 批量修改DOM样式
- 使用 `transform` 和 `opacity` 进行动画，这些属性不会触发重排
- 使用 `will-change` 属性提示浏览器优化

## 8 现代 CSS 特性

### 8.1 Flexbox 和 Grid 布局
- 优先使用Flexbox和Grid进行布局，避免使用float布局
- 熟悉并正确使用这些现代布局技术的属性

```css
/* Flexbox示例 */
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Grid示例 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### 8.2 其他现代特性
- 利用CSS变量进行主题切换
- 使用CSS动画和过渡增强用户体验
- 了解并使用CSS Logical Properties提高国际化支持

## 9 注释规范

### 9.1 注释风格
- 模块注释：使用 `/* 模块名 */` 标识大的样式模块
- 功能注释：对复杂样式或特殊处理添加说明
- 临时注释：使用 `TODO:` 标记需要后续修改的地方

```css
/* 导航栏模块 */
.navigation {
  /* 使用flex布局水平排列 */
  display: flex;
  justify-content: space-between;
  /* TODO: 移动端导航需要优化 */
}
```

## 10 代码格式化

### 10.1 格式统一
- 使用 Prettier 自动格式化CSS代码
- 统一缩进（推荐使用2个空格）
- 统一换行和空格规范

### 10.2 语法规范
- 使用简写属性（如 `margin`, `padding`, `background`）
- 省略0值后的单位
- 十六进制颜色使用小写字母，缩写形式（如 `#fff` 而非 `#FFFFFF`）