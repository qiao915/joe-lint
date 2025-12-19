// JavaScript 语言规则配置
import { baseRules, baseEnv, baseGlobals, baseParserOptions } from './base.js';

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
      // JavaScript 特定规则
      "no-unused-vars": "error", // 禁止声明后未使用的变量 / 函数 / 参数
      "indent": ["error", 2], // 缩进使用2个空格
      "array-callback-return": "error" // 确保数组方法的回调函数有返回值
    }
  }
};