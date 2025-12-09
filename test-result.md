# 编码质量检查报告

生成时间：2025/12/9 14:48:29
发现问题总数：37
涉及文件数：5

## 详细问题列表

### 文件：/Users/wuqiao/myCode/前端审计/joe-lint/bin/cli.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 10 | 43 | null | 错误 | Parsing error: Unexpected token with |

### 文件：/Users/wuqiao/myCode/前端审计/joe-lint/src/config.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 155 | 37 | no-undef | 错误 | 'process' is not defined. |
| 166 | 7 | no-undef | 错误 | 'console' is not defined. |
| 184 | 20 | no-prototype-builtins | 错误 | Do not access Object.prototype method 'hasOwnProperty' from target object. |

### 文件：/Users/wuqiao/myCode/前端审计/joe-lint/src/gitHook.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 14 | 5 | no-undef | 错误 | 'console' is not defined. |
| 25 | 5 | no-undef | 错误 | 'console' is not defined. |
| 27 | 5 | no-undef | 错误 | 'console' is not defined. |
| 35 | 35 | no-undef | 错误 | 'process' is not defined. |
| 42 | 7 | no-undef | 错误 | 'console' is not defined. |
| 43 | 28 | no-undef | 错误 | 'require' is not defined. |
| 64 | 28 | no-undef | 错误 | 'process' is not defined. |
| 67 | 25 | no-undef | 错误 | 'require' is not defined. |
| 77 | 27 | no-undef | 错误 | 'require' is not defined. |
| 86 | 27 | no-undef | 错误 | 'require' is not defined. |
| 105 | 30 | no-undef | 错误 | 'require' is not defined. |
| 112 | 7 | no-undef | 错误 | 'console' is not defined. |
| 114 | 9 | no-undef | 错误 | 'console' is not defined. |
| 121 | 5 | no-undef | 错误 | 'console' is not defined. |

### 文件：/Users/wuqiao/myCode/前端审计/joe-lint/src/lint.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 3 | 33 | no-unused-vars | 错误 | 'existsSync' is defined but never used. |
| 9 | 7 | no-unused-vars | 错误 | 'asyncExec' is assigned a value but never used. |
| 32 | 25 | no-undef | 错误 | 'process' is not defined. |
| 42 | 25 | no-undef | 错误 | 'Promise' is not defined. |
| 99 | 5 | no-undef | 错误 | 'console' is not defined. |
| 112 | 41 | no-undef | 错误 | 'process' is not defined. |
| 145 | 9 | no-undef | 错误 | 'console' is not defined. |
| 149 | 5 | no-undef | 错误 | 'console' is not defined. |
| 182 | 5 | no-undef | 错误 | 'console' is not defined. |
| 213 | 5 | no-undef | 错误 | 'console' is not defined. |
| 241 | 5 | no-undef | 错误 | 'console' is not defined. |
| 258 | 5 | no-undef | 错误 | 'console' is not defined. |

### 文件：/Users/wuqiao/myCode/前端审计/joe-lint/src/reporter.js

| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |
|------|------|--------|----------|----------|
| 75 | 25 | no-undef | 错误 | 'process' is not defined. |
| 76 | 3 | no-undef | 错误 | 'console' is not defined. |
| 85 | 5 | no-undef | 错误 | 'console' is not defined. |
| 89 | 3 | no-undef | 错误 | 'console' is not defined. |
| 101 | 5 | no-undef | 错误 | 'console' is not defined. |
| 104 | 7 | no-undef | 错误 | 'console' is not defined. |
| 108 | 3 | no-undef | 错误 | 'console' is not defined. |

## 统计信息

| 类型 | 数量 |
|------|------|
| 错误 | 37 |
| 警告 | 0 |
| 总计 | 37 |

## 按规则统计

| 规则ID | 出现次数 |
|--------|----------|
| no-undef | 33 |
| no-unused-vars | 2 |
| null | 1 |
| no-prototype-builtins | 1 |
