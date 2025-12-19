#!/usr/bin/env node

import { program } from 'commander';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chalk from 'chalk';
import { lint } from '../src/lint.js';
import { getConfig } from '../src/config.js';
import { setupGitHooks, checkCommitMessage } from '../src/gitHook.js';
// 简单的JSON导入方式
import fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
const version = packageJson.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
  .name('joe-lint')
  .version(version, '-v, --version', 'Show current version / 显示当前版本')
  .description('Front-end coding quality control tool / 前端集合型编码质量控制工具')
  .option('-c, --config <path>', 'Custom config file path /自定义配置文件路径')
  .option('-o, --output <file>', 'Output audit results to specified markdown file / 输出审计结果到指定的markdown文件')
  .option('-s, --staged', 'Only check git staged files / 只检查git暂存的文件')
  .option('-d, --dir <paths...>', 'Check specified folders or files / 检查指定文件夹或指定文件')
  .option('--max-files <number>', 'Set maximum number of files to check to avoid memory issues /  设置最大检查文件数量，避免内存问题')
  .option('--setup', 'Configure git hooks / 配置git hooks')
  .option('--commitlint <file>', 'Check commit message format / 检查commit消息格式');

// 解析命令行参数
program.parse(process.argv);
const options = program.opts();

// 获取普通命令行参数（非选项参数）
const args = program.args;

// 如果是帮助或版本命令，Commander.js会自动处理，不会执行到这里

async function run() {
  try {
    // 获取配置
    const config = await getConfig(options.config);
    
    // 处理setup命令
    if (options.setup) {
      await setupGitHooks({ config });
      return;
    }
    
    // 处理commitlint命令
    if (options.commitlint) {
      const passed = await checkCommitMessage(options.commitlint, { config });
      process.exit(passed ? 0 : 1);
      return;
    }
    
    // 合并选项和普通参数作为要检查的文件或目录
    let targetPaths = [];
    if (options.dir) {
      targetPaths = Array.isArray(options.dir) ? options.dir : [options.dir];
    }
    if (args.length > 0) {
      targetPaths = [...targetPaths, ...args];
    }
    
    // 执行lint
    const results = await lint({
      config,
      staged: options.staged,
      outputFile: options.output,
      files: targetPaths.length > 0 ? targetPaths : undefined,
      dir: targetPaths.length > 0 ? targetPaths[0] : process.cwd(),
      maxFiles: options.maxFiles ? parseInt(options.maxFiles) : undefined
    });
    
    if (results.errors.length > 0) {
      console.log(chalk.yellow(`Total ${results.errors.length} errors found / 共发现 ${results.errors.length} 个错误`));
    } else {
      console.log(chalk.green('✓ Code quality check passed! / 代码质量检查通过！'));
      console.log(chalk.green(`Checked ${results.files.length} files in total 共检查 ${results.files.length} 个文件`));
      process.exit(0);
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}
run();