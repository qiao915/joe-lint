import { promisify } from 'util';
import { exec } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';
import simpleGit from 'simple-git';
import { getConfig } from './config.js';
import { renderMarkdownReport } from './reporter.js';

const asyncExec = promisify(exec);
const git = simpleGit();

/**
 * 主lint函数
 * @param {Object} options - 选项
 * @param {Object} options.config - 配置
 * @param {boolean} options.staged - 是否只检查暂存文件
 * @param {string} options.outputFile - 输出文件路径
 * @returns {Promise<Object>} 检查结果
 */
export async function lint(options = {}) {
  const config = options.config || getConfig();
  const staged = options.staged || false;
  const outputFile = options.outputFile || config.output.file;
  
  let files = [];
  
  if (staged) {
    // 获取暂存文件
    files = await getStagedFiles();
  } else {
    // 获取所有文件
    files = getAllFiles(process.cwd(), config);
  }
  
  // 过滤文件类型
  const filteredFiles = files.filter(file => {
    const ext = extname(file).substring(1).toLowerCase();
    return config.fileTypes.includes(ext);
  });
  
  // 执行lint检查
  const results = await Promise.all(
    filteredFiles.map(async file => {
      return await lintFile(file, config);
    })
  );
  
  // 收集错误
  const errors = results.flat().filter(result => result.error);
  
  // 生成报告
  if (errors.length > 0) {
    await renderMarkdownReport(errors, outputFile);
  }
  
  return {
    files: filteredFiles,
    errors
  };
}

/**
 * 获取暂存文件
 * @returns {Promise<Array>} 暂存文件列表
 */
async function getStagedFiles() {
  const result = await git.diff(['--name-only', '--cached']);
  return result.trim().split('\n').filter(file => file);
}

/**
 * 获取所有文件
 * @param {string} dir - 目录路径
 * @param {Object} config - 配置
 * @returns {Array} 文件列表
 */
function getAllFiles(dir, config) {
  const files = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry);
      const stats = statSync(fullPath);
      
      // 检查是否忽略
      if (shouldIgnore(fullPath, config)) {
        continue;
      }
      
      if (stats.isDirectory()) {
        files.push(...getAllFiles(fullPath, config));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
  
  return files;
}

/**
 * 检查文件是否应该被忽略
 * @param {string} filePath - 文件路径
 * @param {Object} config - 配置
 * @returns {boolean} 是否忽略
 */
function shouldIgnore(filePath, config) {
  const relativePath = filePath.replace(process.cwd(), '').substring(1);
  
  return config.ignore.some(pattern => {
    if (pattern.endsWith('/')) {
      return relativePath.startsWith(pattern);
    }
    return relativePath === pattern || relativePath.endsWith(pattern);
  });
}

/**
 * 检查单个文件
 * @param {string} file - 文件路径
 * @param {Object} config - 配置
 * @returns {Promise<Array>} 检查结果
 */
async function lintFile(file, config) {
  const ext = extname(file).substring(1).toLowerCase();
  const linterConfig = config.linters[ext];
  
  if (!linterConfig || !linterConfig.enabled) {
    return [];
  }
  
  try {
    switch (linterConfig.tool) {
      case 'eslint':
        return await lintWithESLint(file, linterConfig.config);
      case 'stylelint':
        return await lintWithStylelint(file, linterConfig.config);
      case 'markdownlint':
        return await lintWithMarkdownlint(file, linterConfig.config);
      default:
        console.warn(`Unknown linter tool: ${linterConfig.tool}`);
        return [];
    }
  } catch (error) {
    console.error(`Error linting file ${file}:`, error.message);
    return [];
  }
}

/**
 * 使用ESLint检查文件
 * @param {string} file - 文件路径
 * @param {Object} config - ESLint配置
 * @returns {Promise<Array>} 检查结果
 */
async function lintWithESLint(file, config) {
  try {
    const eslint = (await import('eslint')).ESLint;
    const eslintInstance = new eslint({
      useEslintrc: false,
      baseConfig: config
    });
    
    const results = await eslintInstance.lintFiles([file]);
    
    return results.flatMap(result => {
      return result.messages.map(message => ({
        file: result.filePath,
        line: message.line,
        column: message.column,
        ruleId: message.ruleId,
        severity: message.severity,
        message: message.message,
        error: message.severity === 2
      }));
    });
  } catch (error) {
    console.error(`ESLint error for ${file}:`, error.message);
    return [];
  }
}

/**
 * 使用Stylelint检查文件
 * @param {string} file - 文件路径
 * @param {Object} config - Stylelint配置
 * @returns {Promise<Array>} 检查结果
 */
async function lintWithStylelint(file, config) {
  try {
    const stylelint = (await import('stylelint')).default;
    const results = await stylelint.lint({
      files: file,
      config
    });
    
    return results.results.flatMap(result => {
      return result.warnings.map(warning => ({
        file: result.source,
        line: warning.line,
        column: warning.column,
        ruleId: warning.rule,
        severity: warning.severity === 'error' ? 2 : 1,
        message: warning.text,
        error: warning.severity === 'error'
      }));
    });
  } catch (error) {
    console.error(`Stylelint error for ${file}:`, error.message);
    return [];
  }
}

/**
 * 使用Markdownlint检查文件
 * @param {string} file - 文件路径
 * @param {Object} config - Markdownlint配置
 * @returns {Promise<Array>} 检查结果
 */
async function lintWithMarkdownlint(file, config) {
  try {
    const markdownlint = (await import('markdownlint')).default;
    const results = await markdownlint({ files: [file], config });
    
    return Object.entries(results).flatMap(([filePath, fileResults]) => {
      return fileResults.map(result => ({
        file: filePath,
        line: result.lineNumber,
        column: result.columnNumber,
        ruleId: result.ruleNames[0],
        severity: 2, // markdownlint只有错误
        message: result.errorDetail,
        error: true
      }));
    });
  } catch (error) {
    console.error(`Markdownlint error for ${file}:`, error.message);
    return [];
  }
}

/**
 * 检查commit消息
 * @param {string} commitMessage - commit消息
 * @param {Object} config - commitlint配置
 * @returns {Promise<boolean>} 是否通过检查
 */
export async function lintCommitMessage(commitMessage, config) {
  try {
    const { lint } = await import('@commitlint/lint');
    const result = await lint(commitMessage, config.commitlint.config);
    return result.valid;
  } catch (error) {
    console.error('Commitlint error:', error.message);
    return false;
  }
}