// EJS 语言规则配置
import { baseRules, baseEnv, baseParserOptions, baseGlobals } from './base.js';

export default {
  enabled: true,
  tool: 'eslint',
  config: {
    extends: ['eslint:recommended'],
    plugins: ['ejs'],
    env: baseEnv,
    globals: baseGlobals,
    parserOptions: baseParserOptions,
    rules: {
      ...baseRules,
      // EJS 特定规则
      "no-console": "warn", // 禁止使用console（警告级别）
      "no-alert": "error", // 禁止使用alert、confirm和prompt
      "no-debugger": "error", // 禁止使用debugger
      "semi": ["error", "always"], // 要求使用分号
      "quotes": ["error", "single"] // 要求使用单引号
    }
  }
};