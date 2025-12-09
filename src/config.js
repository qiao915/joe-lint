import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// 默认配置
const defaultConfig = {
  // 支持的文件类型
  fileTypes: [
    'html', 'css', 'js', 'ts', 'vue', 'react', 'markdown', 'ejs',
    'jsx', 'tsx', 'less', 'scss'
  ],
  
  // 检查器配置
  linters: {
    js: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended'],
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module'
        }
      }
    },
    ts: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended', '@typescript-eslint/recommended'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint']
      }
    },
    jsx: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended', 'plugin:react/recommended'],
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        },
        plugins: ['react']
      }
    },
    tsx: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended', '@typescript-eslint/recommended', 'plugin:react/recommended'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint', 'react']
      }
    },
    css: {
      enabled: true,
      tool: 'stylelint',
      config: {
        extends: ['stylelint-config-standard']
      }
    },
    less: {
      enabled: true,
      tool: 'stylelint',
      config: {
        extends: ['stylelint-config-standard'],
        customSyntax: 'postcss-less'
      }
    },
    scss: {
      enabled: true,
      tool: 'stylelint',
      config: {
        extends: ['stylelint-config-standard-scss']
      }
    },
    html: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended', 'plugin:html/recommended'],
        plugins: ['html']
      }
    },
    vue: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
        parser: 'vue-eslint-parser'
      }
    },
    markdown: {
      enabled: true,
      tool: 'markdownlint',
      config: {
        extends: 'markdownlint/style/markdownlint-style-default'
      }
    },
    ejs: {
      enabled: true,
      tool: 'eslint',
      config: {
        extends: ['eslint:recommended'],
        plugins: ['ejs']
      }
    }
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
    'yarn.lock'
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
      console.error('Failed to read config file:', error.message);
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
function mergeConfig(defaultConfig, userConfig) {
  const merged = { ...defaultConfig };
  
  for (const key in userConfig) {
    if (Object.prototype.hasOwnProperty.call(userConfig, key)) {
      if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
        merged[key] = mergeConfig(defaultConfig[key] || {}, userConfig[key]);
      } else {
        merged[key] = userConfig[key];
      }
    }
  }
  
  return merged;
}