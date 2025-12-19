# joe-lint

一个前端集合型编码质量控制工具，整合了多种第三方工具的能力，提供统一的命令行界面和报告格式，支持作为依赖包引入项目中使用。

## 功能特性

- ✅ **多文件类型支持**：HTML、CSS、JS、TS、Vue、React、Markdown、EJS、JSX、TSX、Less、Scss等
- ✅ **集成多种检查工具**：ESLint、Stylelint、Prettier、commitlint等
- ✅ **全量扫描**：扫描整个项目代码或指定目录，输出详细的Markdown格式报告
- ✅ **Git Hook支持**：配置到husky钩子中，对commit的文件进行校验
- ✅ **自定义规则**：支持通过JSON配置文件自定义校验规则
- ✅ **提交信息校验**：支持校验Git commit消息格式
- ✅ **中英文双语报告**：生成包含中英文对照的Markdown格式报告
- ✅ **作为依赖引用**：支持在Node.js项目中作为依赖包引入使用
- ✅ **框架集成**：支持与Vue、React、Node.js工程无缝集成

## 系统要求

- **Node.js**: v14.13.0 或更高版本（支持ES模块）

## 安装

### 全局安装

```bash
npm install -g joe-lint
```

### 本地安装（推荐）

```bash
npm install joe-lint --save-dev
```

## 快速开始

### 基本用法

```bash
# 扫描当前目录下的所有文件
joe-lint

# 扫描指定目录
joe-lint /path/to/your/project
```

### 注意事项
- 单次扫描最多可检查**500**个文件，以避免内存问题。

### 框架工程集成

#### Vue工程集成

在`package.json`的scripts中添加：

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "dev": "joe-lint && vite",
  "build": "joe-lint && vite build"
}
```

#### React工程集成

在`package.json`的scripts中添加：

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "start": "joe-lint && react-scripts start",
  "build": "joe-lint && react-scripts build"
}
```

#### Node.js工程集成

在`package.json`的scripts中添加：

```json
"scripts": {
  "lint": "joe-lint",
  "lint-staged": "joe-lint --staged",
  "start": "joe-lint && node index.js",
  "dev": "joe-lint && nodemon index.js"
}
```

### 检查暂存文件

```bash
# 只检查Git暂存的文件
joe-lint --staged
```

### 自定义输出文件

```bash
# 扫描并将结果输出到指定文件
joe-lint --output my-lint-report.md
```

### 配置Git Hook

### 自动配置

使用 `joe-lint --setup` 命令自动配置Git hooks：

```bash
joe-lint --setup
```

### 手动配置

在项目的 `.husky` 目录下创建钩子文件：

#### pre-commit 钩子

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --staged
```

#### commit-msg 钩子

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --commitlint "$1"
```

```bash
# 配置Git hooks（pre-commit和commit-msg）
joe-lint --setup
```

## 命令参数

| 参数 | 简写 | 描述 |
|------|------|------|
| `--config <path>` | `-c` | 自定义配置文件路径 |
| `--output <file>` | `-o` | 指定输出报告的文件名 |
| `--staged` | `-s` | 只检查Git暂存的文件 |
| `--dir <paths...>` | `-d` | 检查指定文件夹或者指定文件 |
| `--setup` | | 配置Git hooks |
| `--commitlint <file>` | | 检查commit消息格式 |
| `--version` | `-v` | 显示当前版本 |
| `--help` | `-h` | 显示帮助信息 |

## 配置文件

### 默认配置

joe-lint 提供了默认的配置文件 `.joelintrc.json`，包含了针对所有支持文件类型的推荐规则。您可以使用此文件作为自定义配置的起点。

### 创建自定义配置

在项目根目录创建 `.joelintrc.json` 文件，示例内容如下：

```json
{
  "fileTypes": [
    "html", "css", "js", "ts", "vue", "react", "markdown", "ejs",
    "jsx", "tsx", "less", "scss"
  ],
  "linters": {
    "js": {
      "enabled": true,
      "rules": {
        "no-console": "warn",
        "semi": ["error", "always"]
      }
    },
    "css": {
      "enabled": true,
      "rules": {
        "indentation": 2
      }
    },
    "ts": {
      "enabled": false
    }
  }
}
```

### 配置选项说明

- **fileTypes**: 要检查的文件类型列表（支持：html, css, js, ts, vue, react, markdown, ejs, jsx, tsx, less, scss）
- **linters**: 各文件类型的检查器配置
  - **enabled**: 是否启用该检查器（true/false）
  - **rules**: 该文件类型的自定义规则（仅可配置的选项）

### 内置默认规则

工具为每种文件类型内置了默认规则。如果未提供自定义规则，则将使用这些默认规则。以下是每种文件类型可配置的主要规则及其说明：

#### Markdown (MD)
- 默认规则：
  ```json
  "markdown": {
    "enabled": true,
    "tool": "markdownlint",
    "config": {
      "default": true,
      "rules": {
        "MD001": true, // 标题层级从h1开始，h1只出现一次
        "MD002": true, // 标题层级必须递增
        "MD003": { "style": "atx" }, // 标题使用atx格式 (#)
        "MD004": { "style": "dash" }, // 列表使用破折号
        "MD007": { "indent": 2 }, // 无序列表缩进为2个空格
        "MD013": false, // 行长度限制（默认关闭）
        "MD047": true // 文件末尾必须有换行符
      }
    }
  }
  ```

#### JavaScript (JS)
- 扩展：`eslint:recommended`
- 解析器选项：ES2022
- 环境：浏览器、Node.js
- 可配置规则示例：
  ```json
  "js": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "error", // 禁止未使用的变量，可选值：error/warn/off
      "no-undef": "error", // 禁止未定义的变量，可选值：error/warn/off
      "no-console": "warn", // 禁止使用console，可选值：error/warn/off
      "no-alert": "error", // 禁止使用alert、confirm和prompt，可选值：error/warn/off
      "no-debugger": "error", // 禁止使用debugger，可选值：error/warn/off
      "semi": ["error", "always"], // 要求或禁止使用分号，可选值：["error", "always"]/["error", "never"]
      "quotes": ["error", "single"], // 要求或禁止使用单引号，可选值：["error", "single"]/["error", "double"]
      "comma-dangle": ["error", "never"], // 要求或禁止使用拖尾逗号，可选值：["error", "never"]/["error", "always"]
      "indent": ["error", 2], // 缩进规则，可选值：["error", 2]/["error", "tab"]
      "no-multi-spaces": "error", // 禁止多个空格，可选值：error/warn/off
      "no-trailing-spaces": "error", // 禁止行尾空格，可选值：error/warn/off
      "eol-last": ["error", "always"], // 要求文件末尾有换行符，可选值：["error", "always"]/["error", "never"]
      "camelcase": "error", // 要求使用驼峰命名法，可选值：error/warn/off
      "no-var": "error", // 禁止使用var，要求使用let或const，可选值：error/warn/off
      "prefer-const": "error", // 要求使用const声明不会被重新赋值的变量，可选值：error/warn/off
      "arrow-parens": ["error", "as-needed"] // 要求箭头函数参数使用圆括号，可选值：["error", "always"]/["error", "as-needed"]
    }
  }
  ```

#### TypeScript (TS)
- 扩展：`eslint:recommended`, `@typescript-eslint/recommended`
- 解析器：`@typescript-eslint/parser`
- 默认规则：
  ```json
  "ts": {
    "enabled": true,
    "rules": {
      "@typescript-eslint/no-unused-vars": "error", // 禁止未使用的变量
      "@typescript-eslint/explicit-function-return-type": "error" // 要求显式函数返回类型
    }
  }
  ```
- 可配置扩展规则示例：
  ```json
  "ts": {
    "enabled": true,
    "rules": {
      "@typescript-eslint/no-unused-vars": "error", // 禁止未使用的变量，可选值：error/warn/off
      "@typescript-eslint/explicit-function-return-type": "warn", // 要求显式函数返回类型，可选值：error/warn/off
      "@typescript-eslint/explicit-module-boundary-types": "warn", // 要求显式模块边界类型，可选值：error/warn/off
      "@typescript-eslint/no-explicit-any": "error", // 禁止使用any类型，可选值：error/warn/off
      "@typescript-eslint/interface-name-prefix": ["error", "never"], // 接口名称前缀规则，可选值：["error", "never"]/["error", "always"]
      "@typescript-eslint/no-empty-function": "warn", // 禁止空函数，可选值：error/warn/off
      "@typescript-eslint/no-namespace": "error", // 禁止使用命名空间，可选值：error/warn/off
      "@typescript-eslint/prefer-interface": "error", // 要求使用interface而不是type定义对象类型，可选值：error/warn/off
      "@typescript-eslint/semi": ["error", "always"] // 要求或禁止使用分号，可选值：["error", "always"]/["error", "never"]
    }
  }
  ```

#### CSS
- 扩展：`stylelint-config-standard`
- 可配置规则示例：
  ```json
  "css": {
    "enabled": true,
    "rules": {
      "indentation": 2, // 缩进大小，可选值：2/4/"tab"
      "at-rule-semicolon-newline-after": "always", // at规则后必须有换行，可选值：always/never
      "block-closing-brace-newline-before": "always", // 块闭合大括号前必须有换行，可选值：always/never
      "block-closing-brace-newline-after": "always", // 块闭合大括号后必须有换行，可选值：always/never
      "block-opening-brace-newline-after": "always-multi-line", // 块开始大括号后必须有换行，可选值：always-multi-line/never
      "declaration-block-trailing-semicolon": "always", // 声明块必须有尾随分号，可选值：always/never
      "declaration-colon-space-after": "always", // 声明冒号后必须有空格，可选值：always/never
      "declaration-colon-space-before": "never", // 声明冒号前禁止有空格，可选值：always/never
      "selector-combinator-space-after": "always", // 选择器组合符后必须有空格，可选值：always/never
      "selector-combinator-space-before": "always", // 选择器组合符前必须有空格，可选值：always/never
      "property-no-unknown": "error", // 禁止未知的属性，可选值：error/warn/off
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // 类名必须以字母开头，只允许小写字母、数字、下划线和减号，可选值：正则表达式
      "color-no-invalid-hex": "error", // 禁止无效的十六进制颜色，可选值：error/warn/off
      "comment-no-empty": "warn", // 禁止空注释，可选值：error/warn/off
      "no-duplicate-selectors": "error", // 禁止重复的选择器，可选值：error/warn/off
      "no-empty-source": "error" // 禁止空源文件，可选值：error/warn/off
    }
  }
  ```

#### Less
- 扩展：`stylelint-config-standard`
- 自定义语法：`postcss-less`
- 可配置规则示例（与CSS基本相同，增加Less特定规则）：
  ```json
  "less": {
    "enabled": true,
    "rules": {
      "indentation": 2, // 缩进大小，可选值：2/4/"tab"
      "at-rule-semicolon-newline-after": "always", // at规则后必须有换行
      "block-closing-brace-newline-before": "always", // 块闭合大括号前必须有换行
      "declaration-block-trailing-semicolon": "always", // 声明块必须有尾随分号
      "less/at-variable-pattern": "^[a-z-]+$", // Less变量命名模式，可选值：正则表达式
      "less/no-duplicate-variables": "error", // 禁止重复的Less变量，可选值：error/warn/off
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // 类名必须以字母开头，只允许小写字母、数字、下划线和减号，可选值：正则表达式
    }
  }
  ```

#### SCSS
- 扩展：`stylelint-config-standard-scss`
- 可配置规则示例：
  ```json
  "scss": {
    "enabled": true,
    "rules": {
      "scss/at-rule-no-unknown": "error", // 禁止未知的at规则，可选值：error/warn/off
      "scss/dollar-variable-pattern": "^[a-z-]+$", // 美元变量命名模式，可选值：正则表达式
      "scss/selector-no-redundant-nesting-selector": "error", // 禁止冗余的嵌套选择器，可选值：error/warn/off
      "scss/no-duplicate-dollar-variables": "error", // 禁止重复的美元变量，可选值：error/warn/off
      "scss/no-duplicate-mixins": "error", // 禁止重复的mixin，可选值：error/warn/off
      "scss/at-import-partial-extension": ["error", "never"], // 要求或禁止导入部分文件时使用扩展名，可选值：["error", "always"]/["error", "never"]
      "scss/mixin-name-pattern": "^[a-z-]+$", // mixin命名模式，可选值：正则表达式
      "scss/function-name-pattern": "^[a-z-]+$", // 函数命名模式，可选值：正则表达式
      "scss/at-mixin-pattern": "^[a-z-]+$", // at-mixin命名模式，可选值：正则表达式
      "scss/at-function-pattern": "^[a-z-]+$", // at-function命名模式，可选值：正则表达式
      "selector-class-pattern": "^[a-zA-Z][a-zA-Z0-9\\-_]*$" // 类名必须以字母开头，只允许小写字母、数字、下划线和减号，可选值：正则表达式
    }
  }
  ```

#### HTML
- 扩展：`eslint:recommended`
- 插件：`html`
- 可配置规则示例（与JavaScript类似，但专注于HTML内联脚本）：
  ```json
  "html": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "warn", // 禁止未使用的变量，可选值：error/warn/off
      "no-undef": "error", // 禁止未定义的变量，可选值：error/warn/off
      "no-console": "warn", // 禁止使用console，可选值：error/warn/off
      "semi": ["error", "always"], // 要求或禁止使用分号
      "quotes": ["error", "single"] // 要求或禁止使用单引号
    }
  }
  ```

#### Vue
- 扩展：`eslint:recommended`, `plugin:vue/vue3-recommended`
- 解析器：`vue-eslint-parser`
- 可配置规则示例：
  ```json
  "vue": {
    "enabled": true,
    "rules": {
      "vue/no-unused-vars": "error", // 禁止未使用的变量，可选值：error/warn/off
      "vue/no-unused-components": "error", // 禁止未使用的组件，可选值：error/warn/off
      "vue/require-default-prop": "warn", // 要求props有默认值，可选值：error/warn/off
      "vue/require-prop-types": "error", // 要求为props提供类型，可选值：error/warn/off
      "vue/html-indent": ["error", 2], // HTML模板缩进，可选值：["error", 2]/["error", "tab"]
      "vue/max-attributes-per-line": ["error", {
        "singleline": 3, // 单行最多属性数
        "multiline": {
          "max": 1, // 多行每行最多属性数
          "allowFirstLine": false // 不允许第一行有多个属性
        }
      }],
      "vue/require-self-closing-components": "error", // 无内容的组件要求组件自闭合<el-time-picker/>，可选值：error/warn/off
      "vue/singleline-html-element-content-newline": "off", // 要求单行HTML元素内容有换行，可选值：error/warn/off
      "vue/multiline-html-element-content-newline": ["error", { // 配置多行元素属性换行规则
        // 仅当元素属性数≥6时强制换行（默认是1，即只要多个属性就换行）
        "minAttributes": 6,
        // 排除无需换行的元素（如<input>、<el-button>）
        "ignoreWhenEmpty": true,
        "ignores": ["input", "el-button", "el-input"]
      }],
      "vue/html-self-closing": ["error", {
        "html": {
          "void": "always",
          "normal": "never",
          "component": "always"
        }
      }], // 要求HTML元素自闭合，可选值：对象配置
      "vue/attribute-hyphenation": ["error", "always"], // 要求HTML属性使用连字符命名，可选值：["error", "always"]/["error", "never"]
      "vue/order-in-components": ["error", {
        "order": [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          "props",
          "emits",
          "setup",
          "asyncData",
          "data",
          "computed",
          "watch",
          "watchQuery",
          "LIFECYCLE_HOOKS",
          "methods",
          "head"
        ]
      }] // 要求组件选项顺序，可选值：数组配置
    }
  }
  ```

#### React (JSX/TSX)
- 扩展：`eslint:recommended`, `@typescript-eslint/recommended` (for TSX), `plugin:react/recommended`
- 解析器选项：JSX 启用
- 可配置规则示例：
  ```json
  "jsx": {
    "enabled": true,
    "rules": {
      "react/prop-types": "off", // 要求组件props有类型检查，可选值：error/warn/off
      "react/react-in-jsx-scope": "off", // React 17+不需要在JSX中导入React，可选值：error/warn/off
      "react/jsx-indent": ["error", 2], // JSX缩进，可选值：["error", 2]/["error", "tab"]
      "react/jsx-indent-props": ["error", 2], // JSX属性缩进，可选值：["error", 2]/["error", "tab"]
      "react/jsx-quotes": ["error", "single"], // 要求JSX属性使用单引号，可选值：["error", "single"]/["error", "double"]
      "react/jsx-semi": ["error", "always"], // 要求JSX使用分号，可选值：["error", "always"]/["error", "never"]
      "react/jsx-uses-vars": "error", // 防止JSX中未使用的变量，可选值：error/warn/off
      "react/jsx-uses-react": "error", // 防止React在JSX中未使用，可选值：error/warn/off
      "react/no-deprecated": "error", // 禁止使用已废弃的React特性，可选值：error/warn/off
      "react/prefer-es6-class": ["error", "always"], // 要求使用ES6类而不是React.createClass，可选值：["error", "always"]/["error", "never"]
      "react/self-closing-comp": "error", // 要求自闭合组件，可选值：error/warn/off
      "react/jsx-no-undef": "error", // 禁止JSX中未定义的组件，可选值：error/warn/off
      "react/jsx-no-bind": "warn" // 禁止在JSX属性中使用箭头函数或bind，可选值：error/warn/off
    }
  }
  ```

#### EJS
- 扩展：`eslint:recommended`
- 插件：`ejs`
- 可配置规则示例（与JavaScript基本相同）：
  ```json
  "ejs": {
    "enabled": true,
    "rules": {
      "no-unused-vars": "warn", // 禁止未使用的变量，可选值：error/warn/off
      "no-undef": "error", // 禁止未定义的变量，可选值：error/warn/off
      "no-console": "warn", // 禁止使用console，可选值：error/warn/off
      "semi": ["error", "always"], // 要求或禁止使用分号
      "quotes": ["error", "single"] // 要求或禁止使用单引号
    }
  }
  ```

#### Markdown
- 使用：`markdownlint` 带默认规则
- 可配置规则示例：
  ```json
  "markdown": {
    "enabled": true,
    "rules": {
      "MD001": true, // 标题级别递增，可选值：true/false
      "MD002": true, // 要求文件顶部有H1标题，可选值：true/false
      "MD003": { "style": "atx" }, // 标题样式，可选值：atx/setext
      "MD004": { "style": "dash" }, // 列表标记样式，可选值：dash/asterisk/plus
      "MD005": true, // 要求列表使用一致的缩进，可选值：true/false
      "MD007": { "indent": 2 }, // 列表项缩进，可选值：2/4
      "MD009": { "br_spaces": 2 }, // 禁止行尾空格，可选值：对象配置
      "MD010": true, // 禁止使用硬制表符，可选值：true/false
      "MD011": true, // 禁止反向链接，可选值：true/false
      "MD012": true, // 禁止重复空行，可选值：true/false
      "MD013": { "line_length": 100 }, // 行长度限制，可选值：number/false
      "MD014": true, // 禁止使用美元符号表示代码块，可选值：true/false
      "MD018": true, // 要求标题有空格，可选值：true/false
      "MD019": true, // 要求标题使用一致的符号，可选值：true/false
      "MD020": true, // 要求代码块使用一致的符号，可选值：true/false
      "MD021": true, // 禁止缩进代码块，可选值：true/false
      "MD022": true, // 要求标题前后有空格，可选值：true/false
      "MD023": true, // 禁止标题前后有空格，可选值：true/false
      "MD024": true, // 禁止重复标题，可选值：true/false
      "MD025": { "level": 1 }, // 要求H1标题唯一，可选值：对象配置
      "MD026": { "punctuation": ".;:!" }, // 禁止标题末尾使用标点符号，可选值：对象配置
      "MD027": true, // 禁止列表项末尾有空格，可选值：true/false
      "MD028": true, // 要求列表项有内容，可选值：true/false
      "MD029": { "style": "ordered" }, // 要求有序列表使用数字，可选值：对象配置
      "MD030": { "br_spaces": 2 }, // 要求换行符使用两个空格，可选值：对象配置
      "MD031": true, // 禁止代码块前后有空行，可选值：true/false
      "MD032": true, // 要求代码块前后有空行，可选值：true/false
      "MD033": { "allowed_elements": ["br", "hr"] }, // 禁止使用HTML元素，可选值：对象配置
      "MD034": true, // 禁止使用裸URL，可选值：true/false
      "MD035": { "style": "---" }, // 水平线样式，可选值：对象配置
      "MD036": true, // 禁止标题使用强调，可选值：true/false
      "MD037": true, // 禁止单词之间的空格，可选值：true/false
      "MD038": true, // 禁止代码块前后有空行，可选值：true/false
      "MD039": true, // 禁止单词之间的空格，可选值：true/false
      "MD040": true, // 要求代码块使用一致的符号，可选值：true/false
      "MD041": true, // 要求文件顶部有H1标题，可选值：true/false
      "MD042": true, // 要求文件有标题，可选值：true/false
      "MD043": { "allowed_elements": ["br", "hr"] }, // 禁止使用HTML元素，可选值：对象配置
      "MD044": { "names": ["TODO"] }, // 要求使用一致的单词拼写，可选值：对象配置
      "MD045": true, // 禁止使用HTML元素，可选值：true/false
      "MD046": { "style": "fenced" }, // 代码块样式，可选值：对象配置
      "MD047": true, // 要求文件末尾有换行符，可选值：true/false
      "MD048": { "style": "consistent" } // 代码块样式，可选值：对象配置
    }
  }
  ```

> 注意：更多规则配置详情可参考对应检查工具的官方文档：
> - ESLint: https://eslint.org/docs/rules/
> - Stylelint: https://stylelint.io/user-guide/rules/
> - TypeScript ESLint: https://typescript-eslint.io/rules/
> - Vue ESLint: https://eslint.vuejs.org/rules/
> - React ESLint: https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
> - Markdownlint: https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md

### Commit消息格式配置

joe-lint 还提供了默认的 commit 消息格式配置文件 `.commitlintrc.json`，基于 `@commitlint/config-conventional` 预设。此文件有助于确保项目中提交消息格式的一致性。

## Git Hook配置

### 自动配置

使用 `joe-lint --setup` 命令自动配置Git hooks：

```bash
joe-lint --setup
```

### 手动配置

在项目的 `.husky` 目录下创建钩子文件：

#### pre-commit 钩子

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --staged
```

#### commit-msg 钩子

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

joe-lint --commitlint "$1"
```

## 支持的文件类型

| 文件类型 | 扩展名 | 检查工具 |
|----------|--------|----------|
| HTML | .html | ESLint |
| CSS | .css | Stylelint |
| JavaScript | .js | ESLint |
| TypeScript | .ts | ESLint |
| Vue | .vue | ESLint |
| React | .jsx, .tsx | ESLint |
| Markdown | .md | markdownlint |
| EJS | .ejs | ESLint |
| Less | .less | Stylelint |
| Scss | .scss | Stylelint |

## 第三方工具集成

- **ESLint**: JavaScript/TypeScript/JSX/TSX/HTML/Vue/EJS检查
- **Stylelint**: CSS/Less/Scss检查
- **commitlint**: Git提交信息检查
- **markdownlint**: Markdown文件检查

## 作为Node.js依赖引用

joe-lint支持在Node.js项目中作为依赖包引入使用，方便在代码中进行定制化调用。

### 安装依赖

```bash
npm install @joe-lint --save-dev
```

### API参考

#### lint(options)

执行代码质量检查

- **options**: 配置选项
  - **files**: 要检查的文件或目录路径，可以是字符串或数组
  - **staged**: 是否只检查Git暂存的文件
  - **config**: 自定义配置对象
  - **outputFile**: 输出报告的文件名

- **返回值**: 检查结果数组

#### lintCommitMessage(commitMessage, config)

检查提交信息格式

- **commitMessage**: 提交信息字符串
- **config**: 配置对象（可选）

- **返回值**: 检查结果对象

#### getConfig(configPath)

获取配置信息

- **configPath**: 配置文件路径（可选）

- **返回值**: 配置对象

#### setupGitHooks()

设置Git钩子

- **返回值**: Promise

### 使用示例

```javascript
import { lint, lintCommitMessage, getConfig, setupGitHooks } from 'joe-lint';

// 示例1：全量扫描指定目录
async function scanDirectory() {
  const result = await lint({
    files: './src', // 扫描src目录
    config: {}
  });
  console.log('扫描结果:', result.length, '个问题');
}

// 示例2：扫描指定文件
async function scanFiles() {
  const result = await lint({
    files: ['index.js', 'styles.css', 'README.md'], // 扫描指定文件
    config: {}
  });
  console.log('扫描结果:', result.length, '个问题');
}

// 示例3：检查提交信息
async function checkCommit() {
  const result = await lintCommitMessage('feat: 添加新功能', {});
  console.log('提交信息检查:', result);
}

// 示例4：设置Git钩子
async function setupHooks() {
  await setupGitHooks();
  console.log('Git钩子已设置');
}

// 示例5：获取配置
function getLintConfig() {
  const config = getConfig('./.joelintrc.json');
  console.log('配置信息:', config);
}

// 执行示例
scanDirectory();
```

## 示例输出

### 报告文件命名规则

生成的Markdown报告文件命名格式为：`joe-lint-result-YYYYMMDDHHmmss.md`，其中包含时间戳以确保文件名的唯一性。

### 中英文双语Markdown报告示例

```markdown
[toc]

# Code Quality Check Report

## Summary
- **Generated at:** 2025/12/11 17:55:46
- **Total Issues:** 4
- **Files Involved:** 1
- **Error Count:** 4
- **Warning Count:** 0


## File: /Users/wuqiao/myCode/前端审计/joe-lint/test-config.js
- **Error Count:** 4
- **Warning Count:** 0

### Problem Details

- **Line 2, Column 7**

  ```
  const unusedVariable = 'This should trigger no-unused-vars'; // 未使用的变量
  ```
  'unusedVariable' is assigned a value but never used.


- **Line 3, Column 5**

  ```
  var age = 25; // 使用var而不是let/const
  ```
  'age' is assigned a value but never used.


- **Line 12, Column 1**

  ```
  testVariable = 'This is a test'
  ```
  'testVariable' is not defined.


- **Line 15, Column 1**

  ```
  unusedFunction();
  ```
  'unusedFunction' is not defined.




---

# 编码质量检查报告

## 摘要
- **生成时间:** 2025/12/11 17:55:46
- **问题总数:** 4
- **涉及文件数:** 1
- **错误数量:** 4
- **警告数量:** 0


## 文件: /Users/wuqiao/myCode/前端审计/joe-lint/test-config.js
- **错误数量:** 4
- **警告数量:** 0

### 问题详情

- **第2行, 第7列**

  ```
  const unusedVariable = 'This should trigger no-unused-vars'; // 未使用的变量
  ```
  'unusedVariable' is assigned a value but never used.


- **第3行, 第5列**

  ```
  var age = 25; // 使用var而不是let/const
  ```
  'age' is assigned a value but never used.


- **第12行, 第1列**

  ```
  testVariable = 'This is a test'
  ```
  'testVariable' is not defined.


- **第15行, 第1列**

  ```
  unusedFunction();
  ```
  'unusedFunction' is not defined.
```

## 许可证

ISC

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个工具！

## 问题反馈

如果在使用过程中遇到任何问题，请在GitHub仓库提交Issue：
[https://github.com/qiao915/joe-lint/issues](https://github.com/qiao915/joe-lint/issues)