import { writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * 渲染Markdown报告
 * @param {Array} errors - 错误列表
 * @param {string} outputFile - 输出文件路径
 * @returns {Promise<void>}
 */
export async function renderMarkdownReport(errors, outputFile) {
  // 按文件分组
  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});

  // 生成Markdown内容
  let markdown = '# 编码质量检查报告\n\n';
  markdown += `生成时间：${new Date().toLocaleString()}\n`;
  markdown += `发现问题总数：${errors.length}\n`;
  markdown += `涉及文件数：${Object.keys(errorsByFile).length}\n\n`;

  markdown += '## 详细问题列表\n\n';

  // 为每个文件生成问题列表
  for (const [file, fileErrors] of Object.entries(errorsByFile)) {
    markdown += `### 文件：${file}\n\n`;
    markdown += '| 行号 | 列号 | 规则ID | 严重程度 | 问题描述 |\n';
    markdown += '|------|------|--------|----------|----------|\n';

    fileErrors.forEach(error => {
      const severity = error.severity === 2 ? '错误' : '警告';
      markdown += `| ${error.line} | ${error.column} | ${error.ruleId} | ${severity} | ${error.message} |\n`;
    });

    markdown += '\n';
  }

  // 生成统计信息
  markdown += '## 统计信息\n\n';
  
  // 按严重程度统计
  const errorCount = errors.filter(e => e.severity === 2).length;
  const warningCount = errors.filter(e => e.severity === 1).length;
  
  markdown += `| 类型 | 数量 |\n`;
  markdown += `|------|------|\n`;
  markdown += `| 错误 | ${errorCount} |\n`;
  markdown += `| 警告 | ${warningCount} |\n`;
  markdown += `| 总计 | ${errors.length} |\n\n`;

  // 按规则ID统计
  const errorsByRule = errors.reduce((acc, error) => {
    if (!acc[error.ruleId]) {
      acc[error.ruleId] = 0;
    }
    acc[error.ruleId]++;
    return acc;
  }, {});

  markdown += '## 按规则统计\n\n';
  markdown += '| 规则ID | 出现次数 |\n';
  markdown += '|--------|----------|\n';

  Object.entries(errorsByRule)
    .sort(([, a], [, b]) => b - a)
    .forEach(([ruleId, count]) => {
      markdown += `| ${ruleId} | ${count} |\n`;
    });

  // 写入文件
  writeFileSync(resolve(process.cwd(), outputFile), markdown, 'utf8');
  console.log(`报告已生成：${outputFile}`);
}

/**
 * 控制台输出结果
 * @param {Array} errors - 错误列表
 */
export function printConsoleResults(errors) {
  if (errors.length === 0) {
    console.log('✓ 没有发现编码质量问题');
    return;
  }

  console.log('✗ 发现以下编码质量问题：');
  
  // 按文件分组
  const errorsByFile = errors.reduce((acc, error) => {
    if (!acc[error.file]) {
      acc[error.file] = [];
    }
    acc[error.file].push(error);
    return acc;
  }, {});

  for (const [file, fileErrors] of Object.entries(errorsByFile)) {
    console.log(`\n${file}:`);
    fileErrors.forEach(error => {
      const severity = error.severity === 2 ? '错误' : '警告';
      console.log(`  ${error.line}:${error.column} ${severity} (${error.ruleId}): ${error.message}`);
    });
  }

  console.log(`\n总计：${errors.length} 个问题`);
}