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
  .version(version, '-v, --version', '显示当前版本')
  .description('前端集合型编码质量控制工具')
  .option('-c, --config <path>', '自定义配置文件路径')
  .option('-o, --output <file>', '输出审计结果到指定的markdown文件')
  .option('-s, --staged', '只检查git暂存的文件')
  .option('--commitlint <file>', '检查commit消息')
  .option('--setup', '配置git hooks');

// 解析命令行参数
program.parse(process.argv);
const options = program.opts();

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
    
    // 执行lint
    const results = await lint({
      config,
      staged: options.staged,
      outputFile: options.output
    });
    
    if (results.errors.length > 0) {
      console.log(chalk.red('✗ 代码质量检查失败！'));
      console.log(chalk.red(`共发现 ${results.errors.length} 个错误`));
      process.exit(1);
    } else {
      console.log(chalk.green('✓ 代码质量检查通过！'));
      console.log(chalk.green(`共检查 ${results.files.length} 个文件`));
      process.exit(0);
    }
  } catch (error) {
    console.error(chalk.red('错误：', error.message));
    process.exit(1);
  }
}

run();