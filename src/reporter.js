import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import chalk from 'chalk';

// 在ES模块中模拟__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 渲染Markdown报告
 * @param {Array} errors - 错误列表
 * @param {string} outputFile - 输出文件路径
 * @param {string} targetPath - 检测目标路径（可选）
 * @returns {Promise<void>}
 */
export async function renderMarkdownReport(errors, outputFile, targetPath = null) {
  // 按文件分组
  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});
  
  // 添加时间戳到文件名
  if (outputFile && outputFile.includes('joe-lint-result.md')) {
    // 使用本地时间生成时间戳
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`; // YYYYMMDDHHmmSS
    outputFile = outputFile.replace('joe-lint-result.md', `joe-lint-result-${timestamp}.md`);
  }

  // 生成统计信息
  const errorCount = errors.filter(e => e.severity === 2).length;
  const warningCount = errors.filter(e => e.severity === 1).length;
  
  // 按规则ID统计
  const statisticsByRule = errors.reduce((acc, error) => {
    if (!acc[error.ruleId]) {
      acc[error.ruleId] = 0;
    }
    acc[error.ruleId]++;
    return acc;
  }, {});
  
  // 排序规则统计
  const sortedStatisticsByRule = Object.entries(statisticsByRule)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  // 构建模板数据
  const templateData = {
    targetPath,
    summary: {
      totalIssues: errors.length,
      filesInvolved: Object.keys(errorsByFile).length,
      errorCount,
      warningCount
    },
    errorsByFile,
    statisticsByRule: sortedStatisticsByRule
  };

  // 读取并渲染模板
  const templatePath = resolve(__dirname, 'templates/index.ejs');
  const markdownContent = await ejs.renderFile(templatePath, templateData);

  // 写入文件
  writeFileSync(resolve(process.cwd(), outputFile), markdownContent, 'utf8');
  console.log(chalk.blue(`Report generated / 报告已生成： ${outputFile}`));
}

/**
 * 控制台输出结果
 * @param {Array} errors - 错误列表
 */
export function printConsoleResults(errors) {
  if (errors.length === 0) {
    console.log(chalk.green('✓ No coding quality issues found / 没有发现编码质量问题'));
    return;
  }

  console.log(chalk.red('✗ Found the following coding quality issues / 发现以下编码质量问题：'));
  
  // 按文件分组
  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});

  for (const [file, fileErrors] of Object.entries(errorsByFile)) {
    console.log(chalk.blue(`\n${file}:`));
    fileErrors.forEach(error => {
      const severity = error.severity === 2 ? chalk.red('✗ Error') + ' 错误' : chalk.yellow('⚠️  Warning') + ' 警告';
      console.log(`  ${error.line}:${error.column} ${severity} (${error.ruleId}): ${error.message}`);
    });
  }

  console.log(chalk.red(`\nTotal / 总计: ${errors.length} issues /个问题`));
}