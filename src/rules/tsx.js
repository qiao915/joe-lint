// TSX 语言规则配置
import { baseRules, baseEnv, baseParserOptions } from './base.js';
import jsxConfig from './jsx.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended', '@typescript-eslint/recommended', 'plugin:react/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    parserOptions: {
      ...baseParserOptions,
      ecmaFeatures: {
        jsx: true
      }
    },
    env: baseEnv,
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...baseRules,
      ...jsxConfig.config.rules,
      // 代码风格规范
      "@typescript-eslint/indent": ["error", 2], // 缩进使用2个空格
      // TypeScript 相关规则
      "@typescript-eslint/explicit-module-boundary-types": "off", // 不要求显式指定模块边界类型
      "@typescript-eslint/no-explicit-any": "off", // 允许使用any类型
      "@typescript-eslint/no-empty-interface": "error", // 禁止空接口
      "@typescript-eslint/no-extra-non-null-assertion": "error", // 禁止额外的非空断言
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error" // 禁止非空断言的可选链
    }
  }
};