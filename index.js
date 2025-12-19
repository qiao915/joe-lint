import { lint, lintCommitMessage } from './src/lint.js';
import { getConfig } from './src/config.js';
import { setupGitHooks } from './src/gitHook.js';

/**
 * joe-lint 主入口模块
 * 提供代码检查、配置获取、Git钩子设置等功能
 */
export {
  /**
   * 执行代码检查
   * @param {Object} options - 选项
   * @param {Object} options.config - 配置对象
   * @param {boolean} options.staged - 是否只检查暂存文件
   * @param {string} options.outputFile - 输出文件路径
   * @param {string|Array} options.files - 指定要检查的文件或目录
   * @returns {Promise<Object>} 检查结果
   */
  lint,
  
  /**
   * 检查commit消息
   * @param {string} commitMessage - commit消息
   * @param {Object} config - commitlint配置
   * @returns {Promise<boolean>} 是否通过检查
   */
  lintCommitMessage,
  
  /**
   * 获取配置
   * @param {string} configPath - 自定义配置文件路径
   * @returns {Object} 合并后的配置
   */
  getConfig,
  
  /**
   * 配置Git hooks
   * @param {Object} options - 选项
   * @param {Object} options.config - 配置
   */
  setupGitHooks
};
