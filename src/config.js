import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

// 导入各语言规则配置
import jsRules from './rules/js.js';
import tsRules from './rules/ts.js';
import jsxRules from './rules/jsx.js';
import tsxRules from './rules/tsx.js';
import cssRules from './rules/css.js';
import scssRules from './rules/scss.js';
import lessRules from './rules/less.js';
import vueRules from './rules/vue.js';
import htmlRules from './rules/html.js';
import ejsRules from './rules/ejs.js';

// 默认配置
const defaultConfig = {
  // 支持的文件类型
  fileTypes: [
    'js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx', 'css', 'less', 'scss', 'html', 'vue', 'ejs'
  ],
  
  // 最大检查文件数量，避免内存问题
  maxFiles: 500,
  
  // 检查器配置
  linters: {
    js: jsRules,
    ts: tsRules,
    jsx: jsxRules,
    tsx: tsxRules,
    css: cssRules,
    less: lessRules, // Less 使用专门的 Less 规则
    scss: scssRules,
    html: htmlRules,
    vue: vueRules,
    ejs: ejsRules
  },
  
  // commitlint配置
  commitlint: {
    enabled: true,
    config: {
      extends: ['@commitlint/config-conventional']
    }
  },
  
  // 忽略文件
  ignore: [
    'node_modules',
    'dist',
    'build',
    '.git',
    '*.log',
    'package-lock.json',
    'yarn.lock',
  ],
  
  // 输出配置
  output: {
    format: 'markdown',
    file: 'joe-lint-result.md'
  },
  
  // git hook配置
  gitHook: {
    enabled: true,
    hooks: {
      "pre-commit": 'lint',
      "commit-msg": 'commitlint'
    }
  }
};

/**
 * 获取配置
 * @param {string} configPath - 自定义配置文件路径
 * @returns {Object} 合并后的配置
 */
export function getConfig(configPath = null) {
  let userConfig = {};
  
  // 尝试从默认位置读取配置文件
  const defaultConfigPath = resolve(process.cwd(), '.joelintrc.json');
  if (!configPath && existsSync(defaultConfigPath)) {
    configPath = defaultConfigPath;
  }
  
  // 读取用户配置
  if (configPath) {
    try {
      const configContent = readFileSync(configPath, 'utf8');
      userConfig = JSON.parse(configContent);
    } catch (error) {
      console.error(chalk.red(`Failed to read configuration file: ${error.message} 无法读取配置文件: ${error.message}`));
    }
  }
  
  // 合并配置
  return mergeConfig(defaultConfig, userConfig);
}

/**
 * 合并配置
 * @param {Object} defaultConfig - 默认配置
 * @param {Object} userConfig - 用户配置
 * @returns {Object} 合并后的配置
 */
export function mergeConfig(defaultConfig, userConfig) {
  const merged = { ...defaultConfig };
  
  // 合并基本配置项
  if (userConfig.maxFiles && typeof userConfig.maxFiles === 'number') {
    merged.maxFiles = userConfig.maxFiles;
  }
  
  // 合并fileTypes配置
  if (userConfig.fileTypes && Array.isArray(userConfig.fileTypes)) {
    merged.fileTypes = userConfig.fileTypes;
  }
  
  // 合并linters配置
  if (userConfig.linters && typeof userConfig.linters === 'object' && userConfig.linters !== null) {
    for (const fileType in userConfig.linters) {
      if (Object.prototype.hasOwnProperty.call(userConfig.linters, fileType)) {
        if (merged.linters[fileType]) {
          // 只合并enabled和rules配置项，保留工具内置的其他配置
          merged.linters[fileType].enabled = userConfig.linters[fileType].enabled !== undefined ? userConfig.linters[fileType].enabled : merged.linters[fileType].enabled;
          
          if (userConfig.linters[fileType].rules && typeof userConfig.linters[fileType].rules === 'object' && userConfig.linters[fileType].rules !== null) {
            // 如果工具配置中没有rules，则创建一个空对象
            if (!merged.linters[fileType].config.rules) {
              merged.linters[fileType].config.rules = {};
            }
            // 合并用户自定义规则
            Object.assign(merged.linters[fileType].config.rules, userConfig.linters[fileType].rules);
          }
        }
      }
    }
  }
  
  return merged;
}