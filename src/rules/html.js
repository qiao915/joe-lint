// HTML 语言规则配置
import { baseRules, baseEnv, baseParserOptions, baseGlobals } from './base.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended'],
    parserOptions: baseParserOptions,
    env: baseEnv,
    globals: baseGlobals,
    rules: {
      ...baseRules,
      // HTML 特定规则
      "no-console": "warn", // 禁止使用console（警告级别）
      "no-alert": "error", // 禁止使用alert、confirm和prompt
      "no-debugger": "error", // 禁止使用debugger
      "quotes": ["error", "double"], // 要求使用双引号
      "semi": ["error", "always"], // 要求使用分号
      "curly": "error", // 要求使用大括号
      "max-len": ["error", {
        "code": 120,
        "tabWidth": 2,
        "ignoreComments": true,
        "ignoreTrailingComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }], // 最大行长度限制
      "no-multiple-empty-lines": ["error", {"max": 1}], // 禁止多个空行

      "htmllint/doctype-first": "error", // 要求DOCTYPE在HTML文档的第一行
      "htmllint/attr-quote-style": ["error", "double"], // 要求属性值使用双引号
      "htmllint/attr-no-unsafe-char": "error", // 禁止属性值包含不安全的字符
      "htmllint/attr-no-dupe": "error", // 禁止重复的属性
      "htmllint/attr-case":"lower", // 要求属性名使用小写
      "htmllint/doctype-html5": "error", // 要求使用HTML5的DOCTYPE
      "htmllint/html-req-lang": "error", // 要求HTML文档包含lang属性
      "htmllint/id-no-dupe": "error", // 禁止重复的id属性值
      "htmllint/max-attrs-per-line": ["error", { "single": 5, "multi": 1 }], // 每个标签最多5个属性，每个属性占一行
      "htmllint/no-unclosed-tag": "error", // 禁止未关闭的标签
      "htmllint/no-unknown-tag": "error", // 禁止未知的标签
      "htmllint/title-require": "error", // 要求HTML文档包含title标签
      "css-no-invalid-property": "error", // 禁止无效的CSS属性
    }
  }
};