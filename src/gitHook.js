import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { getConfig } from './config.js';

/**
 * 配置Git hooks
 * @param {Object} options - 选项
 * @param {Object} options.config - 配置
 */
export async function setupGitHooks(options = {}) {
  const config = options.config || getConfig();
  
  if (!config.gitHook || !config.gitHook.enabled) {
    console.log('Git hook配置已禁用');
    return;
  }

  try {
    // 检查是否已安装husky
    await checkAndInstallHusky();
    
    // 配置husky
    await configureHusky(config);
    
    console.log('Git hooks配置完成');
  } catch (error) {
    console.error('配置Git hooks失败:', error.message);
  }
}

/**
 * 检查并安装husky
 */
async function checkAndInstallHusky() {
  const packageJsonPath = resolve(process.cwd(), 'package.json');
  
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    
    // 检查是否已安装husky
    if (!packageJson.devDependencies || !packageJson.devDependencies.husky) {
      console.log('正在安装husky...');
      const { execSync } = require('child_process');
      execSync('npm install husky --save-dev', { stdio: 'inherit' });
      
      // 启用husky
      execSync('npx husky install', { stdio: 'inherit' });
      
      // 将prepare脚本添加到package.json
      packageJson.scripts = packageJson.scripts || {};
      if (!packageJson.scripts.prepare) {
        packageJson.scripts.prepare = 'husky install';
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
      }
    }
  }
}

/**
 * 配置husky
 * @param {Object} config - 配置
 */
async function configureHusky(config) {
  const hooksDir = resolve(process.cwd(), '.husky');
  
  // 创建husky目录
  const { mkdirSync } = require('fs');
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir, { recursive: true });
  }
  
  // 配置pre-commit hook
  if (config.gitHook.hooks['pre-commit']) {
    const preCommitPath = resolve(hooksDir, 'pre-commit');
    writeFileSync(preCommitPath, '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\njoe-lint --staged\n', 'utf8');
    // 设置可执行权限
    const { chmodSync } = require('fs');
    chmodSync(preCommitPath, '755');
  }
  
  // 配置commit-msg hook
  if (config.gitHook.hooks['commit-msg']) {
    const commitMsgPath = resolve(hooksDir, 'commit-msg');
    writeFileSync(commitMsgPath, '#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\njoe-lint --commitlint "$1"\n', 'utf8');
    // 设置可执行权限
    const { chmodSync } = require('fs');
    chmodSync(commitMsgPath, '755');
  }
}

/**
 * 检查commit消息
 * @param {string} commitMsgPath - commit消息文件路径
 * @param {Object} options - 选项
 * @returns {boolean} 是否通过检查
 */
export async function checkCommitMessage(commitMsgPath, options = {}) {
  const config = options.config || getConfig();
  
  if (!config.commitlint || !config.commitlint.enabled) {
    return true;
  }
  
  try {
    const { readFileSync } = require('fs');
    const commitMessage = readFileSync(commitMsgPath, 'utf8').trim();
    
    const { lint } = await import('@commitlint/lint');
    const result = await lint(commitMessage, config.commitlint.config);
    
    if (!result.valid) {
      console.error('Commit消息不符合规范:');
      result.errors.forEach(error => {
        console.error(`  - ${error.message}`);
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查commit消息失败:', error.message);
    return false;
  }
}