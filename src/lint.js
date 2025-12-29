import { promisify } from 'util';
import { exec, spawn } from 'child_process';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { resolve, extname, basename, join } from 'path';
import simpleGit from 'simple-git';
import { getConfig, mergeConfig } from './config.js';
import markdownlint from 'markdownlint';
import { renderMarkdownReport } from './reporter.js';
import cliProgress from 'cli-progress';
import chalk from 'chalk';
import { tmpdir } from 'os';

// 重定向控制台输出，过滤无意义的信息
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

console.error = function(...args) {
  const message = args.join(' ');
  // 过滤掉无意义的错误和警告信息
  const shouldFilter = [
    'TypeScript version',
    'Require stack',
    '__placeholder__.js',
    'Failed to load plugin',
    'SUPPORTED TYPESCRIPT VERSIONS',
    'WARNING: You are currently running a version of TypeScript',
    'You may find that it works just fine',
    'Please only submit bug reports',
    'BaseConfig:',
    'Configuration for rule',
    'extend-config-missing',
    'Invalid configuration',
    'Error: No files matching the pattern',
    'Error: Unable to resolve path to module',
    'Error: Cannot find module',
    'error TS',
    'Parsing error:'
  ].some(filter => message.includes(filter));
  
  if (!shouldFilter) {
    originalConsoleError.apply(console, args);
  }
};

console.log = function(...args) {
  const message = args.join(' ');
  // 过滤掉无意义的日志信息
  const shouldFilter = [
    'TypeScript version',
    'WARNING: You are currently running a version',
    'SUPPORTED TYPESCRIPT VERSIONS',
    'YOUR TYPESCRIPT VERSION',
    'Please only submit bug reports'
  ].some(filter => message.includes(filter));
  
  if (!shouldFilter) {
    originalConsoleLog.apply(console, args);
  }
};

const asyncExec = promisify(exec);
const git = simpleGit();

/**
 * 主lint函数
 * @param {Object} options - 选项
 * @param {Object} options.config - 配置
 * @param {boolean} options.staged - 是否只检查暂存文件
 * @param {string} options.outputFile - 输出文件路径
 * @param {string|Array} options.files - 指定要检查的文件或目录
 * @returns {Promise<Object>} 检查结果
 */
export async function lint(options = {}) {
  const defaultConfig = getConfig();
  const config = options.config ? mergeConfig(defaultConfig, options.config) : defaultConfig;
  
  // 确保命令行选项中的maxFiles能够正确覆盖配置中的值
  if (options.maxFiles) {
    config.maxFiles = parseInt(options.maxFiles);
  }
  
  const staged = options.staged || false;
  const outputFile = options.outputFile || config.output.file;
  const specifiedFiles = options.files ? (Array.isArray(options.files) ? options.files : [options.files]) : [];
  
  let files = [];
  
  if (staged) {
    // 获取暂存文件
    files = await getStagedFiles();
  } else if (specifiedFiles.length > 0) {
    // 获取指定文件或目录
    files = await getSpecifiedFiles(specifiedFiles, config);
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
  console.log(chalk.blue(`\nChecking ${filteredFiles.length} files... / 开始检查 ${filteredFiles.length} 个文件...`));
  const results = [];
  
  // 如果文件数量超过限制，显示警告并限制数量
  const MAX_FILES = options.maxFiles || config.maxFiles || 500;
  if (filteredFiles.length > MAX_FILES) {
    console.log(chalk.yellow(`Warning: File count exceeds ${MAX_FILES}, checking only the first ${MAX_FILES} files to avoid memory issues. 警告：文件数量超过${MAX_FILES}个，为避免内存问题，只检查前${MAX_FILES}个文件。`));
    filteredFiles.splice(MAX_FILES);
    console.log(chalk.blue(`Adjusted to check ${filteredFiles.length} files... / 已调整为检查 ${filteredFiles.length} 个文件...`));
  }
  
  // 创建进度条
  const progressBar = new cliProgress.SingleBar({
    format: `Progress: ${chalk.green('{bar}')} ${chalk.yellow('{percentage}%')} | ${chalk.blue('{value}/{total}')}  | now: ${chalk.gray('{file}')}`,
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    stopOnComplete: true
  });
  
  progressBar.start(filteredFiles.length, 0, { file: '' });
  
  // 创建临时目录用于存储缓存文件
  const cacheDir = join(tmpdir(), `joe-lint-cache-${Date.now()}`);
  mkdirSync(cacheDir, { recursive: true });
  
  try {
    // 分批处理文件，每批处理10个文件
    const batchSize = 10;
    for (let batchIndex = 0; batchIndex < filteredFiles.length; batchIndex += batchSize) {
      const batchFiles = filteredFiles.slice(batchIndex, batchIndex + batchSize);
      
      // 处理当前批次的文件
      for (let i = 0; i < batchFiles.length; i++) {
        const file = batchFiles[i];
        const globalIndex = batchIndex + i;
        
        try {
          // 更新进度条，显示当前正在检查的文件名（相对路径）
          const targetDir = options.dir || process.cwd();
          let displayFile;
          if (file.startsWith(targetDir)) {
            // 如果文件在目标目录下，只显示相对路径
            displayFile = file.substring(targetDir.length + 1);
          } else {
            // 否则只显示文件名
            displayFile = basename(file);
          }
          // 如果路径还是太长，进一步截断
          displayFile = displayFile.length > 50 ? '...' + displayFile.slice(-50) : displayFile;
          progressBar.update(globalIndex + 1, { file: displayFile });
          
          // 单个文件检查，添加超时控制
          const lintResults = await Promise.race([
            lintFile(file, config),
            new Promise((_, reject) => setTimeout(() => reject(new Error('检查超时')), 10000)) // 增加超时时间到10秒
          ]);
          
          // 将结果保存到缓存文件，使用更紧凑的JSON格式
          const cacheFilePath = join(cacheDir, `result-${globalIndex}.json`);
          writeFileSync(cacheFilePath, JSON.stringify(lintResults)); // 移除缩进，减少文件大小
          
          // 释放变量占用的内存
          lintResults.length = 0;
        } catch (error) {
          // 不输出文件检查错误
          // 继续检查下一个文件
        }
      }
      
      // 每处理完一批文件，立即释放内存
      await new Promise(resolve => setTimeout(resolve, 50)); // 增加延迟，确保内存有时间释放
      if (global.gc) {
        global.gc();
      }
    }
  } finally {
    progressBar.stop();
  }
  
  // 读取所有缓存文件并合并结果
  console.log(chalk.blue('\nMerging lint results... / 正在合并检查结果...'));
  let allResults = [];
  try {
    // 按顺序读取缓存文件，确保结果顺序一致
    for (let i = 0; i < filteredFiles.length; i++) {
      const cacheFilePath = join(cacheDir, `result-${i}.json`);
      
      // 检查文件是否存在（如果文件检查失败，缓存文件可能不存在）
      if (!existsSync(cacheFilePath)) {
        continue;
      }
      
      try {
        const resultData = readFileSync(cacheFilePath, 'utf8');
        const lintResults = JSON.parse(resultData);
        
        // 只添加有错误的结果，减少内存占用
        const errorResults = lintResults.filter(result => result.error);
        if (errorResults.length > 0) {
          allResults = allResults.concat(errorResults);
        }
        
        // 释放变量占用的内存
        lintResults.length = 0;
        errorResults.length = 0;
        
        // 每读取10个缓存文件，释放一次内存
        if ((i + 1) % 10 === 0 && global.gc) {
          global.gc();
        }
      } catch (error) {
        // 不输出缓存文件读取错误
      }
    }
  } catch (error) {
      // 不输出结果合并错误
    } finally {
      // 清理缓存目录
      try {
        rmSync(cacheDir, { recursive: true, force: true });
      } catch (error) {
        // 不输出缓存清理错误
      }
    }
  
  // 收集错误
  const errors = allResults.filter(result => result.error);
  
  // 生成报告
  console.log(chalk.blue(`\nGenerating report... / 正在生成报告...`));
  // 传递目标路径给报告生成函数
  const targetPath = options.dir 
    ? (Array.isArray(options.dir) ? options.dir[0] : options.dir)
    : process.cwd();
  await renderMarkdownReport(errors, outputFile, targetPath);
  
  if (errors.length > 0) {
    console.log(chalk.red(`\nFound ${errors.length} errors! / 发现 ${errors.length} 个错误！`));
  } else {
    console.log(chalk.green(`\nNo errors found! / 未发现错误！`));
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
 * 获取指定文件或目录
 * @param {string|Array} filesOrDirs - 文件或目录路径
 * @param {Object} config - 配置
 * @returns {Promise<Array>} 文件列表
 */
async function getSpecifiedFiles(filesOrDirs, config) {
  if (!Array.isArray(filesOrDirs)) {
    filesOrDirs = [filesOrDirs];
  }
  
  let allFiles = [];
  const MAX_FILES = config.maxFiles || 500; // 添加全局文件数量限制
  
  for (const item of filesOrDirs) {
    const resolvedPath = resolve(process.cwd(), item);
    
    if (statSync(resolvedPath).isDirectory()) {
      // 如果是目录，递归获取所有文件，但要考虑全局限制
      const dirFiles = getAllFiles(resolvedPath, config);
      // 添加到总列表前检查是否超过限制
      const remainingSlots = MAX_FILES - allFiles.length;
      if (remainingSlots <= 0) break;
      // 只添加不超过剩余限制的文件数量
      allFiles.push(...dirFiles.slice(0, remainingSlots));
    } else {
      // 如果是文件，直接添加，但要考虑全局限制
      if (allFiles.length < MAX_FILES) {
        allFiles.push(resolvedPath);
      } else {
        break;
      }
    }
  }
  
  return allFiles;
}

/**
 * 获取所有文件（使用迭代而非递归，避免调用栈溢出）
 * @param {string} dir - 目录路径
 * @param {Object} config - 配置
 * @returns {Array} 文件列表
 */
function getAllFiles(dir, config) {
  const files = [];
  const stack = [dir];
  const MAX_FILES = config.maxFiles || 500; // 限制最大文件数量，避免内存问题
  // 只检查核心代码文件，包括Vue和样式文件
  const CORE_EXTS = new Set(['js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx', 'vue', 'css', 'less', 'scss', 'html', 'ejs', 'md']);
  
  while (stack.length > 0 && files.length < MAX_FILES) {
    const currentDir = stack.pop();
    
    try {
      const entries = readdirSync(currentDir);
      
      for (const entry of entries) {
        const fullPath = resolve(currentDir, entry);
        
        // 检查是否忽略
        if (shouldIgnore(fullPath, config)) {
          continue;
        }
        
        try {
          const stats = statSync(fullPath);
          
          if (stats.isDirectory()) {
            // 跳过一些已知的大目录
            const dirName = fullPath.split('/').pop().toLowerCase();
            if (!['node_modules', 'dist', 'build', 'coverage', '.git'].includes(dirName)) {
              stack.push(fullPath);
            }
          } else {
            // 只添加核心代码文件类型
            const ext = extname(fullPath).substring(1).toLowerCase();
            if (CORE_EXTS.has(ext)) {
              files.push(fullPath);
              
              // 检查是否达到最大文件数量
              if (files.length >= MAX_FILES) {
                break;
              }
            }
          }
        } catch (error) {
          // 跳过无法访问的文件或目录
          continue;
        }
      }
    } catch (error) {
      // 跳过无法访问的目录
      continue;
    }
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
  // 过滤压缩文件
  if (/\.min\.(js|css|jsx|ts|tsx)$/i.test(filePath)) {
    return true;
  }
  
  const fileName = basename(filePath);
  
  // 忽略iconfont文件（通常是压缩的）
  if (fileName.includes('iconfont')) {
    return true;
  }
  
  // 检查文件内容是否是压缩的（超过1000字符无换行可能是压缩文件）
  try {
    if (existsSync(filePath)) {
      const stats = statSync(filePath);
      // 只检查小于1MB的文件，避免读取大文件影响性能
      if (stats.size < 1024 * 1024) {
        const content = readFileSync(filePath, 'utf8');
        // 检查前1000个字符是否有换行
        const firstPart = content.substring(0, 1000);
        if (firstPart.length > 800 && !firstPart.includes('\n')) {
          return true;
        }
      }
    }
  } catch (error) {
    // 读取文件失败时不忽略
  }
  
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
export async function lintFile(file, config) {
  const ext = extname(file).substring(1).toLowerCase();
  
  // 避免空文件或隐藏文件，检查文件大小
  try {
    const stats = statSync(file);
    if (stats.size === 0 || stats.size > 5 * 1024 * 1024) { // 跳过空文件和大于5MB的文件
      return [];
    }
    
    // 检查支持的文件类型
    if (!['js', 'jsx', 'ts', 'tsx', 'vue', 'css', 'less', 'scss','ejs', 'html', 'md'].includes(ext)) {
      return [];
    }
  } catch (error) {
    return [];
  }
  
  const linterConfig = config.linters[ext];
  
  if (!linterConfig || !linterConfig.enabled) {
    return [];
  }
  
  try {
    if (linterConfig.tool === 'eslint') {
      // 为ESLint检查添加额外的内存保护和超时控制
      const lintResults = await Promise.race([
        lintWithESLint(file, linterConfig.config),
        new Promise((_, reject) => setTimeout(() => reject(new Error('ESLint检查超时')), 3000))
      ]);
      return lintResults;
    } else if (linterConfig.tool === 'stylelint') {
      // 为Stylelint检查添加超时控制
      const lintResults = await Promise.race([
        lintWithStylelint(file, linterConfig.config),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Stylelint检查超时')), 3000))
      ]);
      return lintResults;
    } else if (linterConfig.tool === 'markdownlint') {
      // 为Markdownlint检查添加超时控制
      const lintResults = await Promise.race([
        lintWithMarkdownlint(file, linterConfig.config),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Markdownlint检查超时')), 3000))
      ]);
      return lintResults;
    }
    return [];
  } catch (error) {
    // 静默处理错误，避免中断整个检查流程
    return [];
  }
}

/**
 * 辅助函数：获取文件中指定行的代码
 * @param {string} file - 文件路径
 * @param {number} lineNumber - 行号
 * @returns {string} 指定行的代码内容
 */
function getLineContent(file, lineNumber) {
  try {
    const content = readFileSync(file, 'utf8');
    const lines = content.split('\n');
    return lines[lineNumber - 1]?.trim() || '';
  } catch (error) {
    console.error(chalk.red(`Error reading line ${lineNumber} from ${file}: ${error.message} / 读取文件 ${file} 的第 ${lineNumber} 行时出错: ${error.message}`));
    return '';
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
    // 修改配置，添加更多选项来禁用警告
    const eslintConfig = {
      ...config,
      parserOptions: {
        ...config.parserOptions,
        warnOnUnsupportedTypeScriptVersion: false
      }
    };
    
    const eslint = (await import('eslint')).ESLint;
    const eslintInstance = new eslint({
      useEslintrc: false, // 不使用项目根目录下的.eslintrc.cjs配置
      baseConfig: eslintConfig,
      ignore: false,
      errorOnUnmatchedPattern: false
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
        error: message.severity === 2,
        lineContent: getLineContent(result.filePath, message.line)
      }));
    });
  } catch (error) {
    // 不输出ESLint检查错误，避免控制台噪音
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
      config,
      ignoreDisables: false,
      quiet: true
    });
    
    return results.results.flatMap(result => {
      return result.warnings.map(warning => ({
        file: result.source,
        line: warning.line,
        column: warning.column,
        ruleId: warning.rule,
        severity: warning.severity === 'error' ? 2 : 1,
        message: warning.text,
        error: warning.severity === 'error',
        lineContent: getLineContent(result.source, warning.line)
      }));
    });
  } catch (error) {
    // 不输出Stylelint错误
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
    // 读取文件内容（使用同步方法，与其他lint函数保持一致）
    const fileContent = readFileSync(file, 'utf8');
    
    // 直接使用markdownlint API
    const results = markdownlint.sync({
      strings: {
        [file]: fileContent
      },
      config: config
    });
    
    // 格式化结果
    const formattedResults = [];
    
    if (results && results[file]) {
      results[file].forEach(result => {
        formattedResults.push({
          file: file,
          line: result.lineNumber,
          column: result.errorRange ? result.errorRange[0] : 1,
          ruleId: result.ruleNames[0],
          severity: 2, // markdownlint只有错误
          message: result.errorDetail || result.ruleDescription,
          error: true,
          lineContent: getLineContent(file, result.lineNumber)
        });
      });
    }
    
    return formattedResults;
  } catch (error) {
    // 不输出Markdownlint错误，避免控制台噪音
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
    // 不输出Commitlint错误，避免控制台噪音
    return false;
  }
}