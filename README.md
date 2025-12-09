# joe-lint

一个前端集合型编码质量控制工具，整合了多种第三方工具的能力，提供统一的命令行界面和报告格式。

## 功能特性

- ✅ **多文件类型支持**：HTML、CSS、JS、TS、Vue、React、Markdown、EJS、JSX、TSX、Less、Scss等
- ✅ **集成多种检查工具**：ESLint、Stylelint、Prettier、commitlint、markdownlint等
- ✅ **全量扫描**：扫描整个项目代码，输出详细的Markdown格式报告
- ✅ **Git Hook支持**：配置到husky钩子中，对commit的文件进行校验
- ✅ **自定义规则**：支持通过JSON配置文件自定义校验规则
- ✅ **提交信息校验**：支持校验Git commit消息格式

## 系统要求

- **Node.js**: v14.13.0 或更高版本（支持ES模块）

## 安装

### 全局安装

```bash
npm install -g @qiao915/joe-lint
```

### 本地安装（推荐）

```bash
npm install @qiao915/joe-lint --save-dev
```

## 快速开始

### 基本用法

```bash
# 扫描当前目录下的所有文件
joe-lint

# 扫描指定目录
joe-lint /path/to/your/project
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
| `--setup` | | 配置Git hooks |
| `--commitlint <file>` | | 检查commit消息格式 |
| `--version` | `-v` | 显示当前版本 |
| `--help` | `-h` | 显示帮助信息 |

## 配置文件

### 创建自定义配置

在项目根目录创建 `.joelintrc.json` 文件，配置示例：

```json
{
  "fileTypes": [
    "html", "css", "js", "ts", "vue", "react", "markdown", "ejs",
    "jsx", "tsx", "less", "scss"
  ],
  "linters": {
    "js": {
      "enabled": true,
      "tool": "eslint",
      "config": {
        "extends": ["eslint:recommended"],
        "rules": {
          "no-console": "warn",
          "semi": ["error", "always"]
        }
      }
    },
    "css": {
      "enabled": true,
      "tool": "stylelint",
      "config": {
        "extends": ["stylelint-config-standard"],
        "rules": {
          "indentation": 2
        }
      }
    }
  },
  "commitlint": {
    "enabled": true,
    "config": {
      "extends": ["@commitlint/config-conventional"]
    }
  },
  "ignore": [
    "node_modules",
    "dist",
    "build",
    ".git",
    "*.log"
  ]
}
```

### 配置选项说明

- **fileTypes**: 支持的文件类型列表
- **linters**: 各文件类型的检查器配置
  - **enabled**: 是否启用该检查器
  - **tool**: 使用的检查工具（eslint/stylelint/markdownlint）
  - **config**: 检查工具的配置
- **commitlint**: commit消息检查配置
- **ignore**: 忽略的文件和目录

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

## 示例输出

### Markdown报告示例

```markdown
# 编码质量检查报告

生成时间：2023-12-10 14:30:00
发现问题总数：5
涉及文件数：2

## 详细问题列表

### 文件：src/index.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 10 | 5 | no-console | 警告 | Unexpected console statement. |
| 15 | 1 | semi | 错误 | Missing semicolon. |

### 文件：src/styles.css

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 5 | 3 | indentation | 错误 | Expected indentation of 2 spaces. |
| 8 | 1 | no-missing-end-of-source-newline | 警告 | Expected newline at end of file. |

## 统计信息

| 类型 | 数量 |
|------|------|
| 错误 | 2 |
| 警告 | 3 |
| 总计 | 5 |
```

## 许可证

ISC

## 贡献

欢迎提交Issue和Pull Request来帮助改进这个工具！

## 问题反馈

如果在使用过程中遇到任何问题，请在GitHub仓库提交Issue：
[https://github.com/qiao915/joe-lint/issues](https://github.com/qiao915/joe-lint/issues)