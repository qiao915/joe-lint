// TypeScript 语言规则配置
import { baseRules, baseEnv, baseGlobals, baseParserOptions } from './base.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended', '@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    env: baseEnv,
    globals: baseGlobals,
    parserOptions: {
      ...baseParserOptions,
      warnOnUnsupportedTypeScriptVersion: false
    },
    rules: {
      ...baseRules,
      // TypeScript 特定规则
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error", // 禁止声明后未使用的变量 / 函数 / 参数
      "indent": "off",
      "@typescript-eslint/indent": ["error", 2], // 缩进使用2个空格
      "@typescript-eslint/no-explicit-any": "off", // 允许使用any类型
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不要求显式指定模块边界类型
      "@typescript-eslint/no-unsafe-optionals": "error" // 要求在可选链操作符中不使用不安全的操作
    }
  }
};